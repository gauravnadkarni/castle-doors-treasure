import { Col, Container, Row } from "react-bootstrap";
import classes from './Leader.module.css';
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { NextPage } from "next";
import { useAuth, useUser } from "@clerk/nextjs";

export interface LeaderProps {
    rank: number
    uid: string
    score: number
    isCurrentUser:boolean
}

const  Leader:NextPage<PropsWithChildren<LeaderProps>>  = (props:PropsWithChildren<LeaderProps>) => {   
    const {
        rank,
        uid,
        score,
    } = props;
    
    return (
        <Row>
            <Col lg={2} md={2}>
                {rank}
            </Col>
            <Col lg={7} md={7}>
                {uid}
            </Col>
            <Col lg={3} md={3}>
                {score}
            </Col>
        </Row>
    );
}

export default Leader;