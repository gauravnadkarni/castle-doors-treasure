import { Card, Col, Container, Row } from "react-bootstrap";
import classes from './Leaderboard.module.css';
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { NextPage } from "next";
import { useAuth, useUser } from "@clerk/nextjs";
import Leader, { LeaderProps } from "./Leader";
import Spinner from "@/components/Spinner";

export interface LeaderboardProps {
    leaders: Array<LeaderProps> | undefined
}

const  Leaderboard:NextPage<PropsWithChildren<LeaderboardProps>>  = (props:PropsWithChildren<LeaderboardProps>) => {   
    const {leaders} = props;
    return (
        <>
            <Card className={classes.panelParent}>
                <Card.Header>
                    <span className={classes.headerTitle}>Leaderboard</span>
                </Card.Header>
                <Card.Body>
                    <Container fluid>
                        <Row className={classes.headerRow}>
                            <Col lg={2} md={2}>
                                Rank
                            </Col>
                            <Col lg={2} md={2}>
                                Image
                            </Col>
                            <Col lg={5} md={5}>
                                Name
                            </Col>
                            <Col lg={3} md={3}>
                                Score
                            </Col>
                        </Row>
                        {leaders && leaders.map((leader,idx) =>(
                            <Leader 
                                key={`idx-${idx}`}
                                index={leader.index+1}
                                uid={leader.uid}
                                rank={leader.rank}
                                score={leader.score}
                                isCurrentUser={leader.isCurrentUser}
                                email={leader.email}
                                firstName={leader.firstName}
                                lastName={leader.lastName}
                                imageUrl={leader.imageUrl}
                            />)
                        )}
                        {!leaders && (<Row>
                            <Col lg={12} md={12} className={classes.centerSpinner}>
                                <Spinner />
                            </Col>
                        </Row>)}
                    </Container>
                </Card.Body>
            </Card>
        </>
    );
}

export default Leaderboard;