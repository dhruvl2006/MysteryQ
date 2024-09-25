"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ThemeToggle from "@/components/toggleTheme";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verifyCode`, {
        username: params.username,
        code: data.code,
      });

      const message = response.data.message;
      if (response.data.success === true) {
        toast({
          title: "Success",
          description: message,
          variant: "default",
        });
        router.replace("/signIn");
      } else {
        toast({
          title: "Failed",
          description: message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-950 text-black dark:text-white">
      <div className="absolute top-2 right-2 sm:top-5 sm:right-5">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-transparent sm:dark:bg-gray-900 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input
                    {...field}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-x-3">
              <Button type="submit">Verify</Button>
              <a href="/signUp">
                <Button
                  className="hover:bg-transparent hover:text-black dark:hover:text-white border border-[#0a0a0a] dark:border-white"
                  type="button"
                >
                  Go Back
                </Button>
              </a>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;
