import { Card, Col, Container, Image, Row } from "react-bootstrap";
import classes from './MyScore.module.css';
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { NextPage } from "next";
import { useAuth, useUser } from "@clerk/nextjs";
import Leader, { LeaderProps } from "./Leader";
import Spinner from "@/components/Spinner";

export interface MyScoreProps {
    score:bigint
    uid:string
    firstName:string
    lastName:string
    imageUrl:string | null
}

const  MyScore:NextPage<PropsWithChildren<MyScoreProps>>  = (props:PropsWithChildren<MyScoreProps>) => {   
    const {
        score,
        imageUrl,
        firstName,
        lastName,
        uid
    } = props;
    
    return (
        <>
            <Card className={classes.panelParent}>
                <Card.Header>
                <span className={classes.headerTitle}>Your score</span>
                </Card.Header>
                <Card.Body>
                    <Container fluid>
                        <Row className={classes.headerRow}>
                            <Col lg={2} md={2}>
                                Image
                            </Col>
                            <Col lg={7} md={7}>
                                Name
                            </Col>
                            <Col lg={3} md={3}>
                                Score
                            </Col>
                        </Row>
                        {(uid === "---") && (<Row>
                            <Col lg={12} md={12} className={classes.centerSpinner}>
                                <Spinner/>
                            </Col>
                        </Row>)}
                        {(uid !== "---") && (<Row className={classes.row}>
                            <Col lg={2} md={2}>
                                <div className={classes.image}>
                                    <Image width="30px" height="30px" alt="profile image" src={imageUrl || "/assets/images/default-avatar.jpg"} roundedCircle/>
                                </div>
                            </Col>
                            <Col lg={7} md={7}>
                                {`${firstName} ${lastName}`}
                            </Col>
                            <Col lg={3} md={3}>
                                {score.toString()}
                            </Col>
                        </Row>)}
                    </Container>
                </Card.Body>
            </Card>
        </>
    );
}

export default MyScore;