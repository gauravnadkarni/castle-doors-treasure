import { Card, Col, Container, Row } from "react-bootstrap";
import classes from './MyRank.module.css';
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { NextPage } from "next";
import { useAuth, useUser } from "@clerk/nextjs";
import Leader, { LeaderProps } from "./Leader";

export interface MyRankProps {
    score:number
    uid:string
    rank:number
}

const  MyRank:NextPage<PropsWithChildren<MyRankProps>>  = (props:PropsWithChildren<MyRankProps>) => {   
    const {
        rank,
        score,
        uid
    } = props;
    
    return (
        <>
            <div>Your Rank</div>
            <Card>
                <Card.Body>
                    <Container fluid>
                        <Row>
                            <Col lg={2} md={2}>
                                Rank
                            </Col>
                            <Col lg={7} md={7}>
                                User
                            </Col>
                            <Col lg={3} md={3}>
                                Score
                            </Col>
                        </Row>
                        <Leader 
                            uid={uid}
                            rank={rank}
                            score={score}
                            isCurrentUser={true}
                        />
                    </Container>
                </Card.Body>
            </Card>
        </>
    );
}

export default MyRank;