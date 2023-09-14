import { Accordion, Button, Card, Col, Container, ProgressBar, Row } from "react-bootstrap";
import classes from './LayoutProgress.module.css';
import classNames from "classnames";
import React, { PropsWithChildren, SyntheticEvent, useEffect, useRef } from "react";
import { NextPage } from "next";
import Loader from "@/components/Loader";

export interface LayoutProgressProps {
    level:{
        currentLevel:number
        maxLevel:number
        minLevel:number
    }
    castle:{
        currentCastle:number
        maxCastle:number
        minCastle:number
    }
}

const  LayoutProgress:NextPage<PropsWithChildren<LayoutProgressProps>>  = (props:PropsWithChildren<LayoutProgressProps>) => {
    const {
        level: {
            currentLevel,
            maxLevel,
            minLevel,
        },
        castle: {
            currentCastle,
            maxCastle,
            minCastle,
        }
    } = props
    
    const levelPerc = (currentLevel/maxLevel)*100;
    const castlePerc = (currentCastle/maxCastle)*100;
 
    return (
        <div className={classes.container}>
            <Row>
                <Col lg={1} className={classes.labelColumn}>
                    Castle
                </Col>
                <Col lg={{offset:1, span: 10}} className={classes.loaderColumn}>
                    <Loader borderFlattened={false} max={maxCastle} min={minCastle} now={currentCastle} variant="warning" label={`${castlePerc}%`}/>
                </Col>
            </Row>
            <Row>
                <Col lg={1} className={classes.labelColumn}>
                    Level
                </Col>
                <Col lg={{offset:1, span: 10}} className={classes.loaderColumn}>
                    <Loader borderFlattened={false} max={maxLevel} min={minLevel} now={currentLevel} variant="warning" label={`${levelPerc}%`}/>
                </Col>
            </Row>
        </div>
    );
}

export default LayoutProgress;