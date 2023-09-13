import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import classes from './TreasureRoute.module.css';
import { CircleFill, CheckCircleFill, XCircleFill, LockFill } from 'react-bootstrap-icons';
import classNames from "classnames";
import { PropsWithChildren, SyntheticEvent } from "react";
import { NextPage } from "next";

export interface ScorecardProps {
    currentLevel:number
    totalLevels:number
    statusOfCurrentLevel: "failed" | "pending"
}

const  TreasureRoute:NextPage<PropsWithChildren<ScorecardProps>>  = (props:PropsWithChildren<ScorecardProps>) => {
    const {
        currentLevel,
        totalLevels,
        statusOfCurrentLevel,
    } = props

    const steps = [];
    let isCurrentPosition = false;
    let isFailed:boolean = (statusOfCurrentLevel==="failed");
    let keyProp = 1;
    for(let idx=1;idx<=totalLevels;idx++) {
        let presentPoint = null;
        let connectedForwardRoute = null;
        if(currentLevel > idx) {
            presentPoint = <div><CheckCircleFill key={`key_${keyProp++}`} color="green" /></div>
        } else if(currentLevel < idx) {
            presentPoint = isFailed ? <div><XCircleFill key={`key_${keyProp++}`} color="red"/></div> : <div><LockFill color="blue"/></div>
        } else {
            presentPoint = isFailed ? <div><XCircleFill key={`key_${keyProp++}`} color="red"/></div> : <div><CircleFill color="orange"/></div>
        }
        steps.push(presentPoint);
        if(idx!==totalLevels) {
            if(idx<currentLevel) {
                connectedForwardRoute = <div key={`key_${keyProp++}`} className={classNames({[classes.route]:true},{[classes.tracedRoute]:true},{[classes.lockedRoute]:false})}></div>
            } else {
                connectedForwardRoute = <div key={`key_${keyProp++}`} className={classNames({[classes.route]:true},{[classes.tracedRoute]:false},{[classes.lockedRoute]:isFailed})}></div>
            }
            steps.push(connectedForwardRoute);
        }
    }
    steps.reverse();
    return (
        <Row>
            <Col className={classes.container}>
                {steps.map((step)=>(step))}
            </Col>
        </Row>
    );
}


{
    /*
        <Row>
            <Col className={classes.container}>
                <div><LockFill color="blue"/></div>
                <div className={classNames(classes.route,classes.lockedRoute)}></div>
                <div className={classes.defaultPoint}><LockFill color="blue"/></div>
                <div className={classNames(classes.route)}></div>
                <div className={classes.defaultPoint}><XCircleFill color="red"/></div>
                <div className={classNames(classes.route)}></div>
                <div className={classes.defaultPoint}><CircleFill color="orange" /></div>
                <div className={classNames(classes.route,classes.tracedRoute)}></div>
                <div className={classes.defaultPoint}><CheckCircleFill color="green" /></div>
                <div className={classNames(classes.route,classes.tracedRoute)}></div>
                <div className={classes.defaultPoint}><CheckCircleFill color="green" /></div>
            </Col>
        </Row>
    */
}

export default TreasureRoute;