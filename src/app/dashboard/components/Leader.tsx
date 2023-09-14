import { Col, Container, Image, Row } from "react-bootstrap";
import classes from './Leader.module.css';
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { NextPage } from "next";
import { currentUser, useAuth, useUser } from "@clerk/nextjs";

export interface LeaderProps {
    index:number
    rank: number
    uid: string
    score: bigint
    isCurrentUser:boolean
    firstName:string | null
    lastName:string | null
    imageUrl:string | null
    email:string | null
}

const  Leader:NextPage<PropsWithChildren<LeaderProps>>  = (props:PropsWithChildren<LeaderProps>) => {   
    const {
        index,
        rank,
        uid,
        score,
        firstName,
        lastName,
        imageUrl,
        email,
        isCurrentUser,
    } = props;

    return (
        <Row className={classNames(classes.row,{[classes.rowOdd]:!(index%2===0)}, {[classes.rowEven]:(index%2===0)},{[classes.currentUserRow]:(isCurrentUser===true)})}>
            <Col lg={2} md={2}>
                {rank}
            </Col>
            <Col lg={2} md={2}>
                <div className={classes.image}>
                    <Image width="30px" height="30px" alt="profile image" src={imageUrl || "/assets/images/default-avatar.jpg"} roundedCircle/>
                </div>
            </Col>
            <Col lg={5} md={5}>
                {`${firstName} ${lastName}`}
            </Col>
            <Col lg={3} md={3}>
                {score.toString()}
            </Col>
        </Row>
    );
}

export default Leader;