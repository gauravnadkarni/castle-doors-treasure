import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: { score: v.int64(), userId: v.string()},
  handler: async (ctx, { userId, score }) => {
    // Send a new message.
    await ctx.db.insert("scores", { userId, score });
  },
});