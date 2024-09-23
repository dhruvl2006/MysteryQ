"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import ThemeToggle from "@/components/toggleTheme";

const LogIn = () => {
  const [isSubmiitting, setIsSubmiitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmiitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log(result);
    if (result?.error) {
      toast({
        title: "LogIn Failed",
        description: result.error,
        variant: "destructive",
      });
    } else {
      router.replace(`/dashboard`);
    }
    setIsSubmiitting(false);
  };

  if (!isMounted) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300">
      <div className="absolute top-2 right-2 sm:top-5 sm:right-5">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-transparent sm:dark:bg-gray-900 rounded-lg shadow-md h-screen sm:h-fit flex flex-col justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-black dark:text-white">
            Get Started
          </h1>
          <p className="mb-4 text-gray-900 dark:text-gray-400">
            SignIn to get your messages
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email/username"
                      {...field}
                      className="bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="password"
                      {...field}
                      className="bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <a
              className="block underline text-blue-600 hover:text-blue-800 visited:text-purple-600 dark:text-blue-400 dark:hover:text-blue-600"
              href="/forgotPassword"
            >
              Forgot Password?
            </a>
            <Button type="submit" disabled={isSubmiitting}>
              {isSubmiitting ? (
                <>
                  <Loader2 className="animate-spin" /> Please wait...
                </>
              ) : (
                "SignIn"
              )}
            </Button>
          </form>
        </Form>
        <div className="flex justify-center items-center gap-1">
          <p>New to MysterQ?</p>
          <a
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600 dark:text-blue-400 dark:hover:text-blue-600"
            href="/signUp"
            target="_blank"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
