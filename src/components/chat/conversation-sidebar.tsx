"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id, Doc } from "../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { useState } from "react";

interface ConversationSidebarProps {
  currentUser: Doc<"users">;
  activeConversationId?: Id<"conversations">;
}

export function ConversationSidebar({
  currentUser,
  activeConversationId,
}: ConversationSidebarProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"conversations" | "users">("conversations");

  const conversations = useQuery(api.conversations.listForUser, {
    userId: currentUser._id,
  });

  const allUsers = useQuery(api.users.getAllExcept, {
    clerkId: currentUser.clerkId,
  });

  const getOrCreate = useMutation(api.conversations.getOrCreate);

  const handleStartConversation = async (otherUser: Doc<"users">) => {
    const convId = await getOrCreate({
      currentUserId: currentUser._id,
      otherUserId: otherUser._id,
    });
    router.push(`/chat/${convId}`);
  };

  const displayName = (u: Doc<"users">) => u.name || u.email;

  const initials = (u: Doc<"users">) =>
    (u.name || u.email)[0].toUpperCase();

  return (
    <div className="flex w-72 flex-col border-r bg-card">
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
              <p className="p-3 text-sm text-muted-foreground">Loading...</p>
            ) : conversations.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">
                No conversations yet. Start one from People tab!
              </p>
            ) : (
              conversations.map((conv) => {
                if (!conv.otherUser) return null;
                return (
                  <button
                    key={conv._id}
                    onClick={() => router.push(`/chat/${conv._id}`)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md p-3 text-left transition-colors hover:bg-accent",
                      activeConversationId === conv._id && "bg-accent"
                    )}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conv.otherUser.imageUrl} />
                      <AvatarFallback>{initials(conv.otherUser)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {displayName(conv.otherUser)}
                      </p>
                      {conv.lastMessage && (
                        <p className="truncate text-xs text-muted-foreground">
                          {conv.lastMessage.body}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 p-2">
            {allUsers === undefined ? (
              <p className="p-3 text-sm text-muted-foreground">Loading...</p>
            ) : allUsers.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">
                No other users yet.
              </p>
            ) : (
              allUsers.map((u) => (
                <button
                  key={u._id}
                  onClick={() => handleStartConversation(u)}
                  className="flex w-full items-center gap-3 rounded-md p-3 text-left transition-colors hover:bg-accent"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={u.imageUrl} />
                    <AvatarFallback>{initials(u)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {displayName(u)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {u.email}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
