"use client"
import Loader from "@/components/Loader";
import { NextPage } from "next";
import { PropsWithChildren } from "react";

const Loading:NextPage<PropsWithChildren> = () => {
    return (     
        <Loader striped animated now={100}/>
    )
  }

export default Loading;