import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import classes from './GameStory.module.css';
import classNames from "classnames";
import { PropsWithChildren, SyntheticEvent } from "react";
import { NextPage } from "next";

export interface StoryProps {
    storyTitle: string
    storyContent: string
    siblingIdentifier: string
    onControlOpened?: ()=>void
    onControlClosed?: ()=>void
    
}

const  Story:NextPage<PropsWithChildren<StoryProps>>  = (props:PropsWithChildren<StoryProps>) => {
    const {
        storyTitle,
        storyContent,
        siblingIdentifier,
        onControlOpened=()=>{},
        onControlClosed=()=>{},
    } = props;
    return (
        <Accordion.Item eventKey={siblingIdentifier}>
            <Accordion.Header>{storyTitle}</Accordion.Header>
            <Accordion.Body onEntered={onControlOpened} onExited={onControlClosed}>
                {storyContent}
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default Story;