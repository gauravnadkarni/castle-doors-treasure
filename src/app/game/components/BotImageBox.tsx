import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import classes from './BotImageBox.module.css';
import classNames from "classnames";
import React, { PropsWithChildren, SyntheticEvent, useRef } from "react";
import { NextPage } from "next";
import Image from "next/image";

export interface BotImageBoxProps {
    imagePath:string
    altText:string
}

const  BotImageBox:NextPage<PropsWithChildren<BotImageBoxProps>>  = (props:PropsWithChildren<BotImageBoxProps>) => {
    const {
        imagePath,
        altText,
    } = props
    
    return (
        <div className={classes.container}>
            <Image
                src={imagePath}
                alt={altText}
            />
        </div>
    );
}

export default BotImageBox;