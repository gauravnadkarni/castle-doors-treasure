import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import classes from './GameStory.module.css';
import classNames from "classnames";
import { PropsWithChildren, SyntheticEvent } from "react";
import { NextPage } from "next";
import Story, { StoryProps } from "./Story";

export interface GameStoryProps {
    stories:Array<StoryProps>
    defaultStorySiblingIdentifier?:string
    isAlwaysOpen:boolean
}

const  GameStory:NextPage<PropsWithChildren<GameStoryProps>>  = (props:PropsWithChildren<GameStoryProps>) => {
    const {
        stories,
        defaultStorySiblingIdentifier,
        isAlwaysOpen,
    } = props;

    if(!stories) {
        return null;
    }

    return (
        <Accordion defaultActiveKey={defaultStorySiblingIdentifier} alwaysOpen={isAlwaysOpen}>
            {stories.map((story)=>(<Story {...story}/>))}
        </Accordion>
    );
}

export default GameStory;