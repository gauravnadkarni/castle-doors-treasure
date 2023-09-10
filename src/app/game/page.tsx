"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Game = () => {
  const router = useRouter();
  useEffect(()=>{
    router.replace("dashboard");
  },[]);
  return null
}

export default Game;
