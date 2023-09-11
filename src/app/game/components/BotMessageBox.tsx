import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import classes from './BotMessageBox.module.css';
import classNames from "classnames";
import React, { PropsWithChildren, SyntheticEvent, useRef } from "react";
import { NextPage } from "next";

export interface BotMessageBoxProps {
    content:Array<{data:string, formatting?:{[key: string]:string}}>
}

const  BotMessageBox:NextPage<PropsWithChildren<BotMessageBoxProps>>  = (props:PropsWithChildren<BotMessageBoxProps>) => {
    const {
        content
    } = props
    
    return (
        <div className={classes.container}>
            {content && content.map((data)=>(<div>
                {data.data}
            </div>))}
        </div>
    );
}

export default BotMessageBox;