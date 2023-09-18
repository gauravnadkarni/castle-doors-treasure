import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import classes from './BotImageBox.module.css';
import classNames from "classnames";
import React, { PropsWithChildren, SyntheticEvent, useRef } from "react";
import { NextPage } from "next";
import Spinner from "@/components/Spinner";

export interface BotImageBoxProps {
    imagePath:string
    altText:string
    isLoading:boolean
}

const  BotImageBox:NextPage<PropsWithChildren<BotImageBoxProps>>  = (props:PropsWithChildren<BotImageBoxProps>) => {
    const {
        imagePath,
        altText,
        isLoading,
    } = props
    console.log(isLoading,imagePath,"--------------------------------------")
    return (
        <div className={classNames(classes.container,{[classes.loading]:isLoading})}>
            {!isLoading && <img
                src={imagePath}
                alt={altText}
                style={{width:"100%", height:"100%"}}
            />}
            {isLoading && <Spinner variant="secondary" />}
        </div>
    );
}

export default BotImageBox;