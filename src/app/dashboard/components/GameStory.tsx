import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import classes from './GameStory.module.css';
import classNames from "classnames";
import { PropsWithChildren, SyntheticEvent } from "react";
import { NextPage } from "next";
import Story, { StoryProps } from "./Story";

export interface GameStoryProps {
    heading:string
    paragraphs:Array<string>
}

const  GameStory:NextPage<PropsWithChildren<GameStoryProps>>  = (props:PropsWithChildren<GameStoryProps>) => {
    const {
        heading,
        paragraphs,
    } = props;

    return (
        <div className={classes.flipCard}>
            <div className={classes.flipCardInner}>
                <div className={classes.flipCardFront}>
                    <img src="/assets/images/castle.png" alt="castle image" style={{width:"100%", height:"500px"}}/>
                    <div className={classes.flipCardFrontText}>{heading}</div>
                </div>
                <div className={classes.flipCardBack}>
                    {paragraphs && paragraphs.map((paragraph, idx)=>(<p key={`idx-${idx}`}>{paragraph}</p>))}
                </div>
            </div>
        </div>
    );
}

export default GameStory;