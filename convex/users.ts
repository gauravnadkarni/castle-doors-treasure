import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: { userId: v.string(), email: v.string() , firstName: v.string(), lastName: v.string(), imageUrl: v.string()},
  handler: async (ctx, { userId, email,firstName, lastName, imageUrl }) => {
    // Send a new message.
    await ctx.db.insert("users", { userId, email,firstName, lastName, imageUrl });
  },
});

export const getByUserId = query({
  args: {userId: v.string()},
  handler: async (ctx, {userId}) => {
    return await ctx.db.query("users").filter((q) => q.eq(q.field("userId"), userId)).first();
  },
});