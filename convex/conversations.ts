import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreate = mutation({
  args: {
    currentUserId: v.id("users"),
    otherUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_participantOne", (q) =>
        q.eq("participantOne", args.currentUserId)
      )
      .collect();

    const found = existing.find(
      (c) => c.participantTwo === args.otherUserId
    );
    if (found) return found._id;

    const reverse = await ctx.db
      .query("conversations")
      .withIndex("by_participantOne", (q) =>
        q.eq("participantOne", args.otherUserId)
      )
      .collect();

    const foundReverse = reverse.find(
      (c) => c.participantTwo === args.currentUserId
    );
    if (foundReverse) return foundReverse._id;

    return await ctx.db.insert("conversations", {
      participantOne: args.currentUserId,
      participantTwo: args.otherUserId,
      lastMessageTime: Date.now(),
    });
  },
});

export const listForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const asOne = await ctx.db
      .query("conversations")
      .withIndex("by_participantOne", (q) =>
        q.eq("participantOne", args.userId)
      )
      .collect();

    const asTwo = await ctx.db
      .query("conversations")
      .withIndex("by_participantTwo", (q) =>
        q.eq("participantTwo", args.userId)
      )
      .collect();

    const all = [...asOne, ...asTwo];
    all.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

    return Promise.all(
      all.map(async (conv) => {
        const otherId =
          conv.participantOne === args.userId
            ? conv.participantTwo
            : conv.participantOne;
        const other = await ctx.db.get(otherId);
        const lastMsg = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conv._id)
          )
          .order("desc")
          .first();
        return { ...conv, otherUser: other, lastMessage: lastMsg };
      })
    );
  },
});
