import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    imageUrl: v.string(),
  }).index("byUserId", ["userId"]),
  scores: defineTable({
    userId: v.string(),
    score: v.int64(),
  }).index("byScore", ["score"]),
});
