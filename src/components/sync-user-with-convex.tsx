"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export function SyncUserWithConvex() {
  const { user, isLoaded } = useUser();
  const upsertUser = useMutation(api.users.upsertFromClerk);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const name =
      (user.fullName && user.fullName.trim()) ||
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
      user.username ||
      user.primaryEmailAddress?.emailAddress ||
      "";

    upsertUser({
      clerkId: user.id,
      name,
      email: user.primaryEmailAddress?.emailAddress ?? "",
      imageUrl: user.imageUrl ?? undefined,
    }).catch((err) => console.error("Failed to sync user with Convex:", err));
  }, [isLoaded, user, upsertUser]);

  return null;
}
