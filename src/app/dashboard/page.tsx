"use client"
import { Col, Container, Row } from "react-bootstrap";
import classes from "./page.module.css";
import classNames from "classnames";
import { PropsWithChildren, SyntheticEvent, useEffect, useState } from "react";
import { NextPage } from "next";
import { useAuth, useUser } from "@clerk/nextjs";
import GameSelector from "./components/GameSelector";
import Leaderboard, { LeaderboardProps } from "./components/Leaderboard";
import GameStory, { GameStoryProps } from "./components/GameStory";
import { useRouter } from "next/navigation";
import Leader from "./components/Leader";
import MyScore from "./components/MyScore";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const LEADERS = [{
    score:12,  
    rank:3,
    uid:"er1",
    isCurrentUser: false,
},{
    score:12,  
    rank:3,
    uid:"er1",
    isCurrentUser: false,
},{
    score:12,  
    rank:3,
    uid:"er1",
    isCurrentUser: false,
},{
    score:12,  
    rank:3,
    uid:"er1",
    isCurrentUser: false,
},{
    score:12,  
    rank:3,
    uid:"er1",
    isCurrentUser: false,
},{
    score:12,  
    rank:3,
    uid:"er1",
    isCurrentUser: false,
},{
    score:12,  
    rank:3,
    uid:"er1",
    isCurrentUser: false,
},{
    score:12,  
    rank:3,
    uid:"er1",
    isCurrentUser: false,
},{
    score:12,  
    rank:3,
    uid:"er1",
    isCurrentUser: false,
},{
    score:12,  
    rank:3,
    uid:"er1",
    isCurrentUser: false,
},{
    score:12,  
    rank:3,
    uid:"er1",
    isCurrentUser: false,
},{
    score:12,  
    rank:3,
    uid:"er1",
    isCurrentUser: false,
},{
    score:12,  
    rank:3,
    uid:"er1",
    isCurrentUser: false,
},{
    score:12,  
    rank:3,
    uid:"er1",
    isCurrentUser: false,
},{
    score:12,  
    rank:3,
    uid:"er1",
    isCurrentUser: false,
},];

const GAME_STORY = {
    heading: "Flip the card to understand the Gameplay",
    paragraphs:[
        `Objective: The goal of the game is to reach the treasure at the end of each of the 10 castles while managing limited lives.`,
        `There are 10 castles in the game. Each castle has varying levels of doors`,
        `At least one door leads to safe passage, and at least two doors contain a monster.
        Some doors may be locked, requiring the player to choose another door to find the safe passage.`,
        `The player starts at the first castle.
        In each level, the player must choose a door.
        Safe doors lead to the next level.
        Doors with monsters require a choice, potentially costing health to survive.
        Some doors may contain health, allowing the player to accumulate more health to trade for life later.
        Locked doors may be present, requiring the player to select another door to find safe passage.
        The player continues to choose doors as long as they have at least one health remaining.
        Upon finding a door that leads to safe passage, the player moves to the next level or the next castle.`,
        `Winning: The player wins the game by successfully reaching the treasure in all castles.`,
        `Losing: The player loses if they run out of both lives and armor, making it impossible to proceed.`,
    ]
}

const processLeaderboard = (leaderboard:Array<{index: number, userId:string, score:bigint, imageUrl?:string, firstName?:string, lastName?:string, email?:string}> | undefined, currentUserId:string) => {
    if(!leaderboard) {
        return leaderboard;
    }

    return leaderboard.map((leader, idx)=>({
        index:idx,
        rank:idx+1,
        uid:leader.userId, 
        score: leader.score, 
        isCurrentUser: (currentUserId===leader.userId),
        email: leader.email || null,
        firstName:leader.firstName || null,
        lastName:leader.lastName || null,
        imageUrl: leader.imageUrl || null,
    }))
}

const  DashboardPage:NextPage<PropsWithChildren>  = (props:PropsWithChildren) => {
    const router = useRouter();
    const { user } = useUser();
    const leaderboard = useQuery(api.scores.listLeaderBoard);
    const myScore = useQuery(api.scores.getMyScore, {userId: (user && user.id) ? (user.id) : ("")});

    return (
        <Container>
            <Row>
                <Col lg={6}>
                    <Row className={classes.rowBottomMargin}>
                        <Col>
                            <GameSelector 
                                onClickOfNewGameButton={(e:SyntheticEvent)=>{
                                    router.push('/game')
                                }}
                                onClickOfLoadGameButton={(e:SyntheticEvent)=>{

                                }}
                            />
                        </Col>
                    </Row>
                    <Row className={classes.rowBottomMargin}>
                        <Col>
                            <GameStory 
                                heading={GAME_STORY.heading}
                                paragraphs={GAME_STORY.paragraphs}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col lg={6}>
                    <Row className={classes.rowBottomMargin}>
                        <Col><Leaderboard leaders={processLeaderboard(leaderboard,((user && user.id) ? (user.id) : ("")))}/></Col>
                    </Row>
                    <Row className={classes.rowBottomMargin}>
                        <Col>
                            <MyScore 
                                uid={((myScore && myScore.userId) ? (myScore.userId) : ("---"))}  
                                score={((myScore && myScore.score) ? (myScore.score) : (BigInt(0)))}
                                firstName={myScore?.firstName || "User"}
                                lastName={myScore?.lastName || ""}
                                imageUrl={myScore?.imageUrl || null}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default DashboardPage;