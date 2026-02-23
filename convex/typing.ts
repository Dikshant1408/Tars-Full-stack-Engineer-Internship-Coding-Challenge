import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const setTyping = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("typing")
      .withIndex("by_userId_conversationId", (q) =>
        q.eq("userId", args.userId).eq("conversationId", args.conversationId)
      )
      .unique();

    if (!args.isTyping) {
      if (existing) await ctx.db.delete(existing._id);
      return;
    }

    if (existing) {
      await ctx.db.patch(existing._id, { updatedAt: Date.now() });
    } else {
      await ctx.db.insert("typing", {
        conversationId: args.conversationId,
        userId: args.userId,
        updatedAt: Date.now(),
      });
    }
  },
});

export const getTypingUsers = query({
  args: {
    conversationId: v.id("conversations"),
    currentUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const threeSecondsAgo = Date.now() - 3000;
    const records = await ctx.db
      .query("typing")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    const active = records.filter(
      (r) =>
        r.userId !== args.currentUserId && r.updatedAt > threeSecondsAgo
    );

    return Promise.all(
      active.map(async (r) => {
        const user = await ctx.db.get(r.userId);
        return user;
      })
    );
  },
});
