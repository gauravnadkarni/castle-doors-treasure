import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import classes from './Scorecard.module.css';
import classNames from "classnames";
import { PropsWithChildren, SyntheticEvent } from "react";
import { NextPage } from "next";

export interface ScorecardProps {
    score:number
}

const  Scorecard:NextPage<PropsWithChildren<ScorecardProps>>  = (props:PropsWithChildren<ScorecardProps>) => {
    const {
        score,
    } = props

    return (
        <div className={classes.container}>
            Score : {score}
        </div>
    );
}

export default Scorecard;