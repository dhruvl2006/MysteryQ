"use client";

import { useToast } from "@/components/hooks/use-toast";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import axios from "axios";
import { useEffect, useState } from "react";
import { questions } from "../../../question";
import { Loader2, SendIcon } from "lucide-react";
import { useSession } from "next-auth/react";

const SendMessage = () => {
  const { toast } = useToast();
  const params = useParams<{ username: string }>();
  const { data: session } = useSession();
  const [user, setUser] = useState(false);

  useEffect(() => {
    if (session && session.user) {
      setUser(true);
    } else {
      setUser(false);
    }
  }, [session]);

  const [suggestMessages, setSuggestMessages] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(data: z.infer<typeof messageSchema>) {
    setIsSending(true);
    try {
      const response = await axios.post(`/api/sendMessage`, {
        username: params.username,
        content: data.content,
      });

      console.log(response.data.message);

      if (
        response.data.message === "User is not accepting messages currently"
      ) {
        toast({
          title: `Failed`,
          description: response.data.message,
          variant: "destructive",
        });
      } else if (response.data.status === 404) {
        toast({
          // title: `Message sent to ${params.username} successfully`,
          title: "User not found",
          variant: "destructive",
        });
      } else {
        toast({
          // title: `Message sent to ${params.username} successfully`,
          title: response.data.message,
          variant: "newVarient",
        });
      }
      form.setValue("content", "");
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast({
        title: `Failed to send message`,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  }

  async function fetchSuggestedMessages() {
    try {
      const randomSuggestions: string[] = [];

      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        const question = questions[randomIndex];

        randomSuggestions.push(question);
      }
      setShowAnimation(false);
      setTimeout(() => {
        setSuggestMessages(randomSuggestions);
        setShowAnimation(true);
      }, 100);
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast({
        title: "Failed to suggest messages",
        description: errorMessage,
      });
    }
  }

  useEffect(() => {
    fetchSuggestedMessages();
  }, []);

  function handleSuggestedMessageClick(message: string) {
    form.setValue("content", message);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-10 w-full p-5 sm:p-10 bg-slate-200 dark:bg-slate-950 transition-colors duration-300">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full xl:w-2/3 space-y-6 border border-slate-300 dark:border-slate-700 rounded-md p-5 sm:p-7 bg-slate-100 dark:bg-slate-900 shadow-lg transition-colors duration-300"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Message to {params.username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your message..."
                    className="resize-none mt-3 p-3 rounded-md bg-slate-200 dark:placeholder:text-slate-200 text-md dark:bg-slate-700 text-slate-900 dark:text-slate-200 shadow-inner border dark:border-slate-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="flex justify-center items-center gap-2 px-5 py-3 text-white  dark:bg-slate-500 dark:hover:bg-slate-600 rounded-md shadow-lg transition-colors duration-300"
            type="submit"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 animate-spin" /> Sending...
              </>
            ) : (
              <>
                Send <SendIcon className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="flex flex-col justify-start w-full xl:w-2/3 gap-6 border border-slate-300 dark:border-slate-700 rounded-md p-5 sm:p-7 bg-slate-100 dark:bg-slate-900 shadow-lg transition-colors duration-300">
        <Button
          onClick={fetchSuggestedMessages}
          className="w-fit mx-auto text-white dark:bg-slate-500  dark:hover:bg-slate-600 px-4 py-2 rounded-md shadow-md transition-colors duration-300"
        >
          Suggest Messages
        </Button>
        <div className="flex flex-col justify-center items-center gap-3">
          {suggestMessages.map((message, index) => (
            <p
              key={index}
              onClick={() => handleSuggestedMessageClick(message)}
              className={`w-full xl:w-[85%] border border-slate-200 dark:text-white dark:border-slate-700 bg-slate-200 dark:bg-slate-700 p-3 text-center rounded-md cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
                showAnimation ? "opacity-0 animate-fade-in" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {message}
            </p>
          ))}
        </div>
      </div>

      {/* Message Board Section */}
      <div className="flex justify-center items-center gap-6 flex-col border border-slate-300 dark:border-slate-700 rounded-md p-5 sm:p-7 w-full xl:w-2/3 bg-slate-100 dark:bg-slate-900 shadow-lg transition-colors duration-300">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {user ? "Go to Dashboard" : "Get Your Message Board"}
        </h1>
        <Button className="text-white dark:bg-slate-500 dark:hover:bg-slate-600 px-5 py-3 rounded-md shadow-lg transition-colors duration-300">
          <a target="_blank" href={user ? "/dashboard" : "/signUp"}>
            {user ? "Dashboard" : "Create Account"}
          </a>
        </Button>
      </div>
    </div>
  );
};

export default SendMessage;
