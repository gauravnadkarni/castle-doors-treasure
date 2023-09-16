"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { resolve } from "path";


const MATRIX_DATA = [
  ["M", "P", "L", "S", "S"],
  ["S", "S", "M", "L", "M", "P"],
  ["L", "P", "S", "M", "S", "M", "M"],
  ["H", "M", "S", "S", "L", "P", "M", "M", "M"],
  ["P", "L", "M", "M", "S", "M", "L", "S", "P"],
  ["M", "H", "S", "S", "M", "P", "L", "L", "M", "P", "S", "S"],
  ["H", "S", "H", "L", "M", "P", "M", "L", "M", "M", "P", "L", "S"],
  ["M", "P", "S", "L", "L", "S", "M", "S", "P", "M", "M", "L", "P"],
  ["L", "H", "P", "M", "S", "M", "S", "P", "L", "P", "M", "L", "M", "S", "P"],
  ["S", "L", "P", "M", "S", "M", "S", "P", "L", "H", "P", "M", "L", "M", "S"],
];


export const chat = action({
    args: {
      messageBody: v.string(),
    },
    handler: async (ctx, {messageBody}):Promise<Array<Array<string>>> => {
      // TODO
      return MATRIX_DATA;
    },
});