"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { Id } from "../../../convex/_generated/dataModel";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface ChatLayoutProps {
  conversationId?: string;
}

export function ChatLayout({ conversationId }: ChatLayoutProps) {
  const { user } = useUser();
  const currentUser = useQuery(
    api.users.getByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar: full-width on mobile when no conversation, fixed width on md+ */}
      <div
        className={cn(
          "flex-col border-r bg-card md:flex md:w-72",
          conversationId ? "hidden md:flex" : "flex w-full"
        )}
      >
        <ChatSidebar
          currentUser={currentUser}
          activeConversationId={conversationId as Id<"conversations"> | undefined}
        />
      </div>

      {/* Chat area: hidden on mobile when no conversation */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          !conversationId && "hidden md:flex"
        )}
      >
        {conversationId ? (
          <ChatWindow
            conversationId={conversationId as Id<"conversations">}
            currentUser={currentUser}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="mx-auto mb-3 h-12 w-12 opacity-20" />
              <p className="text-xl font-semibold">Welcome to {APP_NAME}</p>
              <p className="mt-2 text-sm">
                Select a conversation or start a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
