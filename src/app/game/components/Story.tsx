import { PropsWithChildren, SyntheticEvent } from "react";
import { NextPage } from "next";
import classes from "./Story.module.css";

export interface StoryProps {
    layoutOfTheLevel:Array<String>
    onClickOfLockedDoor:(e:SyntheticEvent)=>void
    onClickOfMonsterDoor:(e:SyntheticEvent)=>void
    onClickOfSavePassageDoor:(e:SyntheticEvent)=>void
    onClickOfHealthDoor:(e:SyntheticEvent)=>void
    onClickOfPointsDoor:(e:SyntheticEvent)=>void
    doorOpenImage:string
    doorCloseImage:string
    monsterImage:string
    pointsImage:string
    healthImage:string
    lockedDoorImage:string
    safePassageImage:string
} 

const Story:NextPage<PropsWithChildren<StoryProps>> = (props:PropsWithChildren<StoryProps>) => {
    const {
        layoutOfTheLevel,
        onClickOfLockedDoor,
        onClickOfMonsterDoor,
        onClickOfSavePassageDoor,
        onClickOfHealthDoor,
        onClickOfPointsDoor,
        doorOpenImage,
        doorCloseImage,
        monsterImage,
        pointsImage,
        healthImage,
        lockedDoorImage,
        safePassageImage,
    } = props;
    
    return null;
}

export default Story;