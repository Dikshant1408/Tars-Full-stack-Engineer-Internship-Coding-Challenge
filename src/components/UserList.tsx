"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchBar } from "@/components/SearchBar";

interface UserListProps {
  currentUser: Doc<"users">;
}

export function UserList({ currentUser }: UserListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

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

  const filtered = allUsers?.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name?.toLowerCase().includes(q) ?? false) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const displayName = (u: Doc<"users">) => u.name || u.email;
  const initials = (u: Doc<"users">) => (u.name || u.email)[0].toUpperCase();

  return (
    <div className="flex flex-col gap-2 p-2">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search people..."
        className="mx-1"
      />

      {filtered === undefined ? (
        <p className="p-3 text-sm text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="p-3 text-sm text-muted-foreground">
          {search ? "No users match your search." : "No other users yet."}
        </p>
      ) : (
        filtered.map((u) => (
          <button
            key={u._id}
            onClick={() => handleStartConversation(u)}
            className="flex w-full items-center gap-3 rounded-md p-3 text-left transition-colors hover:bg-accent"
          >
            <div className="relative shrink-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src={u.imageUrl} />
                <AvatarFallback>{initials(u)}</AvatarFallback>
              </Avatar>
              {u.isOnline && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{displayName(u)}</p>
              <p className="truncate text-xs text-muted-foreground">
                {u.isOnline ? (
                  <span className="text-green-500">Online</span>
                ) : (
                  u.email
                )}
              </p>
            </div>
          </button>
        ))
      )}
    </div>
  );
}
