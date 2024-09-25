"use client";

import { useToast } from "@/components/hooks/use-toast";
import ThemeToggle from "@/components/toggleTheme";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgetPassword } from "@/schemas/forgetPasswordSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ForgetPasswordPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof forgetPassword>>({
    resolver: zodResolver(forgetPassword),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgetPassword>) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post<ApiResponse>(
        `/api/forgetPassword`,
        data
      );
      const message = response.data.message || "Request successful!";
      toast({
        title: "Success",
        description: message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || "An error occurred.";
      toast({
        title: "Request Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="w-full h-screen bg-slate-100 dark:bg-slate-950 flex flex-col space-y-10">
      <div className="absolute top-2 right-2 sm:top-5 sm:right-5">
        <ThemeToggle />
      </div>
      <div className="max-w-md mx-auto pt-10 p-6 rounded-lg shadow-md dark:bg-transparent sm:dark:bg-slate-900 h-screen sm:h-fit flex flex-col justify-center relative">
        <div>
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">
            Enter username/email to receive a verification email
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-gray-200 text-lg">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        className="bg-gray-50 dark:bg-gray-700 dark:text-gray-300 w-full text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-white dark:text-black font-semibold w-full transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
