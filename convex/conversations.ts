import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreate = mutation({
  args: {
    currentUserId: v.id("users"),
    otherUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("conversations").collect();
    const found = all.find(
      (c) =>
        !c.isGroup &&
        c.members.includes(args.currentUserId) &&
        c.members.includes(args.otherUserId)
    );
    if (found) return found._id;

    return await ctx.db.insert("conversations", {
      members: [args.currentUserId, args.otherUserId],
      isGroup: false,
      createdAt: Date.now(),
    });
  },
});

export const listForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("conversations").collect();
    const mine = all.filter((c) => c.members.includes(args.userId));
    mine.sort((a, b) => b.createdAt - a.createdAt);

    return Promise.all(
      mine.map(async (conv) => {
        const otherMemberId = conv.members.find((id) => id !== args.userId);
        const otherUser = otherMemberId ? await ctx.db.get(otherMemberId) : null;
        const lastMsg = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conv._id)
          )
          .order("desc")
          .first();
        return { ...conv, otherUser, lastMessage: lastMsg };
      })
    );
  },
});
