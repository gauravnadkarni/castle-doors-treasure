import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: { score: v.int64(), userId: v.string()},
  handler: async (ctx, { userId, score }) => {
    await ctx.db.insert("scores", { userId, score });
  },
});

export const listLeaderBoard = query({
  args: {},
  handler: async (ctx) => {
    const leaderScores = await ctx.db.query("scores").withIndex("byScore").order("desc").take(10);
    if(!leaderScores) {
      return [];
    }

    return Promise.all(
      leaderScores.map(async (leader,idx) => {
        const userData = await ctx.db.query("users").filter((q) => q.eq(q.field("userId"), leader.userId)).first();
        return {
          ...leader,
          index:idx,
          imageUrl: userData?.imageUrl,
          firstName: userData?.firstName,
          lastName: userData?.lastName,
          email:userData?.email
        }
      }
    ));
  },
});

export const getMyScore = query({
  args: {userId: v.string()},
  handler: async (ctx, {userId}) => {
    const myScore = await ctx.db.query("scores").filter((q) => q.eq(q.field("userId"), userId)).first();
    const userData = await ctx.db.query("users").filter((q) => q.eq(q.field("userId"), userId)).first();
    return {
      ...myScore,
      ...userData,
    }
  },
});

export const updateMyScore = mutation({
  args: { userId: v.string(), score: v.int64() },
  handler: async (ctx, args) => {
    const { userId, score } = args;
    const myScore = await ctx.db.query("scores").filter((q) => q.eq(q.field("userId"), userId)).first();
    
    if(!myScore) {
      return;
    }
    let dbScore = 0n;
    if(myScore && myScore.score) {
      dbScore = myScore.score
    }
    dbScore+=score;
 
    await ctx.db.patch(myScore._id, { score: dbScore});
  },
});