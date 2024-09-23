"use client";

import { useToast } from "@/components/hooks/use-toast";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/user.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Clipboard, Copy, Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const DashBoard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/acceptMessages");
      setValue("acceptMessages", response.data.isAcceptingMessage);
      setIsSwitchLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || "Failed to fetch message settings";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const fetchMessages = async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/getMessages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: response.data.message,
          variant: "default",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || "Failed to fetch messages";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/acceptMessages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "newVarient",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || "Failed to switch";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const { username } = session?.user || {};
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Url Copied",
      description: "Profile url copied to clipboard",
    });
  };

  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white dark:bg-slate-900 rounded shadow-lg sm:w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-slate-100">
        User Dashboard
      </h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-slate-300">
          Copy Your Unique Link
        </h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-3 font-bold mr-2 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-200 rounded"
          />
          <Button onClick={copyToClipboard} className="p-2">
            <a href={profileUrl} target="_blank" rel="noopener noreferrer">
              <Copy />
            </a>
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-300">
          Accepting Messages
        </h2>
        <div className="flex items-center space-x-2">
          {isSwitchLoading ? (
            <Loader2 className="animate-spin h-5 w-5 text-gray-500 dark:text-slate-400" />
          ) : (
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="bg-gray-100 dark:bg-slate-600"
            />
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-300">
          Messages
        </h2>
        <Button onClick={() => fetchMessages(true)} variant="ghost">
          <RefreshCcw className={isLoading ? "animate-spin" : ""} />
        </Button>
      </div>

      {isLoading ? (
        <Loader2 className="animate-spin h-10 w-10 mx-auto text-gray-500 dark:text-slate-400" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message: any) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={() => handleDeleteMessage(message._id)}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 dark:text-slate-400">
              No messages found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DashBoard;
