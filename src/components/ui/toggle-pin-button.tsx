"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { type PostWithAuthor } from "@/server/api/routers/post";

import { Button } from "./button";
import { Icons } from "./icons";

interface TogglePinButtonProps {
  post: PostWithAuthor;
}

export default function TogglePinButton({ post }: TogglePinButtonProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const { mutate } = api.post.togglePinned.useMutation({
    mutationKey: ["post.togglePinned", post.id, post.isPinned],
    networkMode: "always",
    onSuccess: () => {
      toast.success(
        post.isPinned
          ? "Post has been unpinned"
          : "Post has been pinned successfully",
      );
    },
    onSettled: () => {
      router.refresh();
      void utils.post.getMany.invalidate({
        isPinned: true,
      });
      void utils.post.getMany.invalidate({});
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onTogglePinned = () => {
    mutate(post.id);
  };
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={onTogglePinned}
      className="flex md:hidden absolute top-0 right-0 rounded-full mt-2 mr-2 group-hover:flex"
    >
      {post.isPinned ? (
        <Icons.unpin className="w-4 h-4" />
      ) : (
        <Icons.pin className="w-4 h-4" />
      )}
    </Button>
  );
}
