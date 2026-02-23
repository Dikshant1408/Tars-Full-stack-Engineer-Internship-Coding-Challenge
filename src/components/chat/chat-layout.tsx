"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ConversationSidebar } from "./conversation-sidebar";
import { MessagePanel } from "./message-panel";
import { Id } from "../../../convex/_generated/dataModel";

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
      <ConversationSidebar
        currentUser={currentUser}
        activeConversationId={conversationId as Id<"conversations"> | undefined}
      />
      <div className="flex flex-1 flex-col">
        {conversationId ? (
          <MessagePanel
            conversationId={conversationId as Id<"conversations">}
            currentUser={currentUser}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-xl font-semibold">Welcome to Tars Chat</p>
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
