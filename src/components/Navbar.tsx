"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import ThemeToggle from "./toggleTheme";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="m-0 p-4 md:p-6 shadow-md bg-slate-100 dark:bg-gray-900 border-b border-slate-500 sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 md:px-0">
        <Link
          href="/"
          className="text-3xl font-extrabold mb-4 md:mb-0 text-gray-800 dark:text-gray-200"
        >
          MysteryQ
        </Link>
        {session ? (
          <div className="flex justify-center items-center space-x-4">
            <ThemeToggle />
            <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              className="transition-all ease-in-out"
              onClick={() => {
                signOut();
              }}
            >
              LogOut
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
            <ThemeToggle />
            <Link href="/signIn">
              <Button className="transition-all ease-in-out m-2">LogIn</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
