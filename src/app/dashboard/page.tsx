"use client"
import { Col, Container, Row } from "react-bootstrap";
import classNames from "classnames";
import { PropsWithChildren, SyntheticEvent } from "react";
import { NextPage } from "next";
import { useAuth, useUser } from "@clerk/nextjs";
import GameSelector from "./components/GameSelector";
import Leaderboard, { LeaderboardProps } from "./components/Leaderboard";
import GameStory, { GameStoryProps } from "./components/GameStory";

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

const GAME_STORIES = {
    defaultStorySiblingIdentifier:"0",
    isAlwaysOpen:true,
    stories:[{
        storyTitle: "Story of the game",
        storyContent: "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", 
        siblingIdentifier:"0"
    }]
}

const  DashboardPage:NextPage<PropsWithChildren>  = (props:PropsWithChildren) => {
    return (
        <Container>
            <Row>
                <Col lg={5}>
                    <div className="d-grid gap-3">
                        <div>
                            <GameSelector 
                                onClickOfNewGameButton={(e:SyntheticEvent)=>{}}
                                onClickOfLoadGameButton={(e:SyntheticEvent)=>{}}
                            />
                        </div>
                        <div>
                            <GameStory 
                                stories={GAME_STORIES.stories} 
                                isAlwaysOpen={GAME_STORIES.isAlwaysOpen} 
                                defaultStorySiblingIdentifier={GAME_STORIES.defaultStorySiblingIdentifier} 
                            />
                        </div>
                    </div>
                </Col>
                <Col lg={{ span: 5, offset: 2 }}>
                    <Leaderboard leaders={LEADERS}/>
                </Col>
            </Row>
        </Container>
    );
}

export default DashboardPage;