"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export function SyncUserWithConvex() {
  const { user, isLoaded } = useUser();
  const upsertUser = useMutation(api.users.upsertFromClerk);
  const setOnlineStatus = useMutation(api.users.setOnlineStatus);

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

    setOnlineStatus({ clerkId: user.id, isOnline: true }).catch(() => {});

    const goOffline = () =>
      setOnlineStatus({ clerkId: user.id, isOnline: false }).catch(() => {});

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") goOffline();
      else setOnlineStatus({ clerkId: user.id, isOnline: true }).catch(() => {});
    };

    window.addEventListener("beforeunload", goOffline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      goOffline();
      window.removeEventListener("beforeunload", goOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLoaded, user, upsertUser, setOnlineStatus]);

  return null;
}
