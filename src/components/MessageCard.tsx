"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import {
  Delete,
  DeleteIcon,
  RemoveFormatting,
  Trash,
  Trash2,
  Trash2Icon,
  X,
} from "lucide-react";
import { Message } from "@/model/user.model";
import { useToast } from "@/components/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/apiResponse";

type MessageCardProp = {
  message: Message;
  onMessageDelete: (messageId: any) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProp) => {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/deleteMessage/${message._id}`
    );
    toast({
      title: response.data.message,
    });
    onMessageDelete(message._id);
  };

  return (
    <Card className="flex justify-between items-start border shadow-lg p-4 rounded-lg bg-white dark:bg-gray-800 ">
      <div className="flex flex-col justify-between gap-5 h-full">
        <CardHeader className="flex flex-col m-0 p-0 text-xl gap-2 font-bold">
          Message from {message.name}
          <CardTitle className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            {message.content}
          </CardTitle>
        </CardHeader>
        <CardContent className="m-0 p-0">
          <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
            Posted on: {new Date(message.createdAt).toLocaleString()}
          </CardDescription>
        </CardContent>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className=" hover:bg-red-500">
            <Trash2Icon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-lg bg-[#09090b] p-6">
          <AlertDialogHeader className="mb-4">
            <AlertDialogTitle className="text-xl font-semibold text-red-600 dark:text-red-400">
              Are you sure?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm text-gray-300 dark:text-gray-400 mt-2">
              This action cannot be undone. This will permanently delete your
              message.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex justify-end space-x-4">
            <AlertDialogCancel className="text-gray-200 hover:text-gray-400 transition-colors">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 text-white hover:bg-red-600 transition-colors px-4 py-2 rounded-lg"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default MessageCard;
