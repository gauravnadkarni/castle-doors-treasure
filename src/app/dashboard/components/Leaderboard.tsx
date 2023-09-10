import { Card, Col, Container, Row } from "react-bootstrap";
import classes from './Leaderboard.module.css';
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { NextPage } from "next";
import { useAuth, useUser } from "@clerk/nextjs";
import Leader, { LeaderProps } from "./Leader";

export interface LeaderboardProps {
    leaders: Array<LeaderProps>
}

const  Leaderboard:NextPage<PropsWithChildren<LeaderboardProps>>  = (props:PropsWithChildren<LeaderboardProps>) => {   
    const {leaders} = props;
    
    return (
        <>
            <div>Leaderboard</div>
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
                        {leaders && leaders.map((leader) =>(
                            <Leader 
                                uid={leader.uid}
                                rank={leader.rank}
                                score={leader.score}
                                isCurrentUser={false}
                            />)
                        )}
                        {!leaders && (<Row>
                            <Col lg={12} md={12}>
                                No leaders as of now
                            </Col>
                        </Row>)}
                    </Container>
                </Card.Body>
            </Card>
        </>
    );
}

export default Leaderboard;