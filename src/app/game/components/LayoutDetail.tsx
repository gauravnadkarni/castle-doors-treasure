import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import classes from './LayoutDetail.module.css';
import classNames from "classnames";
import { PropsWithChildren, SyntheticEvent } from "react";
import { NextPage } from "next";

export interface LayoutDetailProps {
    castle:number
    level:number
}

const  LayoutDetail:NextPage<PropsWithChildren<LayoutDetailProps>>  = (props:PropsWithChildren<LayoutDetailProps>) => {
    const {
        castle,
        level,
    } = props
    
    return (
        <div className={classes.container}>
            <span className={classes.castleSpan}>Castle : {castle}</span>
            <span className={classes.levelSpan}>Level : {level}</span>
        </div>
    );
}

export default LayoutDetail;