import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: { userId: v.string(), email: v.string() , firstName: v.string(), lastName: v.string()},
  handler: async (ctx, { userId, email,firstName, lastName }) => {
    // Send a new message.
    await ctx.db.insert("users", { userId, email,firstName, lastName });
  },
});