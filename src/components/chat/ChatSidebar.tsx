"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id, Doc } from "../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Users } from "lucide-react";
import { cn, formatTimestamp } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { useState } from "react";
import { UserList } from "@/components/UserList";

interface ChatSidebarProps {
  currentUser: Doc<"users">;
  activeConversationId?: Id<"conversations">;
}

export function ChatSidebar({
  currentUser,
  activeConversationId,
}: ChatSidebarProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"conversations" | "users">("conversations");

  const conversations = useQuery(api.conversations.listForUser, {
    userId: currentUser._id,
  });

  const displayName = (u: Doc<"users">) => u.name || u.email;
  const initials = (u: Doc<"users">) =>
    (u.name || u.email)[0].toUpperCase();

  return (
    <div className="flex h-full w-full flex-col md:w-72">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-lg font-bold">{APP_NAME}</h1>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>

      <Separator />

      {/* Tabs */}
      <div className="flex">
        <button
          onClick={() => setTab("conversations")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 py-2 text-sm font-medium transition-colors",
            tab === "conversations"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          Chats
        </button>
        <button
          onClick={() => setTab("users")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 py-2 text-sm font-medium transition-colors",
            tab === "users"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Users className="h-4 w-4" />
          People
        </button>
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        {tab === "conversations" ? (
          <div className="flex flex-col gap-0.5 p-2">
            {conversations === undefined ? (
              <div className="flex flex-col items-center gap-2 p-6 text-muted-foreground">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm">Loading conversations…</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-6 text-center text-muted-foreground">
                <MessageSquare className="h-10 w-10 opacity-30" />
                <p className="text-sm font-medium">No conversations yet</p>
                <p className="text-xs">Start one from the People tab!</p>
              </div>
            ) : (
              conversations.map((conv) => {
                if (!conv.otherUser) return null;
                const isActive = activeConversationId === conv._id;
                const hasUnread = (conv.unreadCount ?? 0) > 0;
                return (
                  <button
                    key={conv._id}
                    onClick={() => router.push(`/chat/${conv._id}`)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md p-3 text-left transition-colors hover:bg-accent",
                      isActive && "bg-accent"
                    )}
                  >
                    {/* Avatar with online dot */}
                    <div className="relative shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conv.otherUser.imageUrl} />
                        <AvatarFallback>
                          {initials(conv.otherUser)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.otherUser.isOnline && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-1">
                        <p
                          className={cn(
                            "truncate text-sm",
                            hasUnread && !isActive
                              ? "font-semibold"
                              : "font-medium"
                          )}
                        >
                          {displayName(conv.otherUser)}
                        </p>
                        {conv.lastMessage && (
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {formatTimestamp(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        {conv.lastMessage ? (
                          <p
                            className={cn(
                              "truncate text-xs",
                              hasUnread && !isActive
                                ? "font-medium text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {conv.lastMessage.body}
                          </p>
                        ) : (
                          <p className="truncate text-xs text-muted-foreground">
                            No messages yet
                          </p>
                        )}
                        {hasUnread && !isActive && (
                          <span className="ml-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                            {(conv.unreadCount ?? 0) > 99
                              ? "99+"
                              : conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        ) : (
          <UserList currentUser={currentUser} />
        )}
      </ScrollArea>
    </div>
  );
}
