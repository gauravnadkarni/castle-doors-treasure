"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { api } from "./_generated/api";
import { resolve } from "path";

// Initialize the OpenAI client with the given API key
const apiKey = process.env.OPENAI_API_KEY!;
const organization = process.env.OPENAI_ORGANIZATION!;
const openai = new OpenAI({
    apiKey// defaults to process.env["OPENAI_API_KEY"]
});

//to be used as fallback if chatgpt is unable to get proper response
// if we hit api rate limits or gpt prompt suggest text or program in place of 2D array
const FAILSAFE_MATRIX_DATA = [
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

function arrayRotate(arr:Array<string>, reverse:boolean, passes:number) {
  for(let i=0;i<passes;i++) {
    if (reverse) {
      const ele = arr.pop();
      if(ele) {
        arr.unshift(ele);
      }
    } 
    else {
      const ele = arr.shift();
      if(ele) {
        arr.push(ele);
      }
    } 
  }
  return arr;
}


export const getLayout = action({
    args: {
      messageBody: v.string(),
    },
    handler: async (ctx, {messageBody}):Promise<Array<Array<string>>> => {
      try {
        
        const response = await openai.chat.completions.create({
          messages: [{
            // Provide a 'system' message to give GPT context about how to respond
            role: "system",
            content:
              "You are a bot in a chat responding to user who is asking for help with generation of 2 dimansional array with 10 rows along with rotation of its rows.You are a friendly assistant. Your answers are JSON array only which can be parsed using JSON.parse function.",
          },{ 
            role: 'user', content: messageBody
          }],
          model: 'gpt-3.5-turbo',
        });
        const responseContent:string | null = response.choices[0].message?.content;
        if(!responseContent) {
          throw new Error("No response from chatGPT")
        }
        const matrix = JSON.parse(responseContent);
        if(!Array.isArray(matrix)) {
          if(!Array.isArray(matrix.array)){
            throw new Error("chatGPT sent the data in a format that we are unable to parse")
          }
        }
        return matrix;
      } catch(err) {
        return FAILSAFE_MATRIX_DATA;
      }
    },
});

export const getRotatedLayout = action({
  args: {
    messageBody: v.string(),
  },
  handler: async (ctx, {messageBody}):Promise<Array<Array<string>>> => {
    // TODO
    try {
      const response = await openai.chat.completions.create({
        messages: [{
          // Provide a 'system' message to give GPT context about how to respond
          role: "system",
          content:
            "You are a bot in a chat responding to user who is asking for help with rotation of rows of a 2 dimansional array with 10 rows.You are a friendly assistant. Your answers are JSON array with all 10 rotated rows only which can be parsed using JSON.parse function.",
        },{ 
          role: 'user', content: messageBody
        }],
        model: 'gpt-3.5-turbo',
      });
      const responseContent:string | null = response.choices[0].message?.content;
      if(!responseContent) {
        throw new Error("No response from chatGPT")
      }
      const matrix = JSON.parse(responseContent);
      if(!Array.isArray(matrix)) {
        if(!Array.isArray(matrix.rotatedArray)){
          throw new Error("chatGPT sent the data in a format that we are unable to parse")
        }
      }
      return matrix;
    } catch(err) {
      //handling rotation with failsafe array
      let alt=false;
      let arr:Array<Array<string>> = [];
      for(let i=0;i<=9;i++) {
        const num= Math.random()*10;
        arr[i] = arrayRotate(FAILSAFE_MATRIX_DATA[i], !alt,num);
      }
      return arr;
    }
  },
});

export const getEmotionImage = action({
  args: {
    messageBody: v.string(),
  },
  handler: async (ctx, {messageBody}):Promise<string | null> => {
    // TODO
    try {
      const response = await openai.images.generate({
        prompt: messageBody,
        n: 1,
        size: "256x256",
      });
      
      if(!response || response.data.length===0 || !response.data[0].url) {
        throw new Error("Unable to find any images at this time");
      }
      return response.data[0].url;
    } catch(err) {
      //return default image
      return null;
    }
  },
});