import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    isOnline: v.boolean(),
    lastSeen: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  conversations: defineTable({
    members: v.array(v.id("users")),
    isGroup: v.boolean(),
    groupName: v.optional(v.string()),
    createdAt: v.number(),
  }),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    body: v.string(),
    createdAt: v.number(),
    isDeleted: v.boolean(),
  })
    .index("by_conversationId", ["conversationId"])
    .index("by_conversationId_createdAt", ["conversationId", "createdAt"]),

  typing: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    updatedAt: v.number(),
  })
    .index("by_conversationId", ["conversationId"])
    .index("by_userId_conversationId", ["userId", "conversationId"]),

  lastRead: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    lastReadAt: v.number(),
  }).index("by_userId_conversationId", ["userId", "conversationId"]),
});
