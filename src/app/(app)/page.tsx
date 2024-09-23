"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session } = useSession();
  const [user, setUser] = React.useState(false);

  React.useEffect(() => {
    if (session && session.user) {
      setUser(true);
    } else {
      setUser(false);
    }
  }, [session]);

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const example = [
    {
      name: "AnonSpeak",
      message: "If you could have any superpower for a day, what would it be?",
    },
    {
      name: "CodedTalk",
      message: "What’s your favorite childhood memory?",
    },
    {
      name: "GhostTalk",
      message: "What’s the most memorable trip you’ve ever taken?",
    },
  ];

  return (
    <div className="flex flex-col justify-between space-y-16 items-center mt-20 w-full max-h-fit px-4">
      <Carousel
        plugins={[plugin.current]}
        opts={{ align: "start" }}
        orientation="horizontal"
        className="w-full sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl my-auto hidden sm:block"
        onMouseEnter={() => plugin.current?.stop()}
        onMouseLeave={() => plugin.current?.reset()}
      >
        <CarouselContent>
          {example.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-4">
                <Card className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <CardContent className="flex flex-col gap-3 items-start justify-center p-8 md:p-10 lg:p-12">
                    <h1 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-200 flex gap-2 items-center">
                      <Mail className="text-2xl" /> Message from {message.name}
                    </h1>
                    <p className="text-sm md:text-md">{message.message}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200" />
        <CarouselNext className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200" />
      </Carousel>

      <Carousel
        plugins={[plugin.current]}
        opts={{ align: "start" }}
        orientation="vertical"
        className="w-full max-w-xs sm:hidden block"
        onMouseEnter={() => plugin.current?.stop()}
        onMouseLeave={() => plugin.current?.reset()}
      >
        <CarouselContent className="h-[150px]">
          {example.map((message, index) => (
            <CarouselItem key={index} className="pt-2 md:basis-1/2">
              <div className="p-2">
                <Card className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow duration-200 w-full">
                  <CardContent className="flex flex-col items-start gap-3 justify-center p-6">
                    <h1 className="text-md sm:text-xl font-semibold text-slate-800 dark:text-slate-200 flex gap-2 items-center">
                      <Mail className="text-2xl" /> Message from {message.name}
                    </h1>
                    <p className="text-sm">{message.message}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200" />
        <CarouselNext className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200" />
      </Carousel>

      <div className="flex justify-center items-center gap-4 flex-col border border-slate-300 dark:border-slate-700 rounded-md p-5 sm:p-6 w-[80%] sm:w-[30%] bg-slate-100 dark:bg-slate-900 shadow-lg transition-colors duration-300">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 text-center">
          {user ? "Go to Dashboard" : "Get Your Message Board"}
        </h1>
        <Button className="text-white dark:bg-slate-500 dark:hover:bg-slate-600 px-4 py-2 rounded-md shadow-lg transition-colors duration-300">
          <a target="_blank" href={user ? "/dashboard" : "/signUp"}>
            {user ? "Dashboard" : "Create Account"}
          </a>
        </Button>
      </div>
    </div>
  );
}
