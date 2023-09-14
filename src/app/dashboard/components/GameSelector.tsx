import { Button, Card, Col, Container, Row } from "react-bootstrap";
import classes from './GameSelector.module.css';
import classNames from "classnames";
import { PropsWithChildren, SyntheticEvent } from "react";
import { NextPage } from "next";
import {Play, ArrowClockwise} from 'react-bootstrap-icons'
import { useAuth, useUser } from "@clerk/nextjs";

export interface GameSelectorProps {
    onClickOfNewGameButton: (e:SyntheticEvent)=>void
    onClickOfLoadGameButton: (e:SyntheticEvent)=>void
}

const  GameSelector:NextPage<PropsWithChildren<GameSelectorProps>>  = (props:PropsWithChildren<GameSelectorProps>) => {
    const {
        onClickOfNewGameButton,
        onClickOfLoadGameButton,
    } = props;
    return (
        <>
            <Card className={classes.panelParent}>
                <Card.Header>
                    <span className={classes.headerTitle}>Game Options</span>
                </Card.Header>
                <Card.Body>
                    <Container fluid>
                        <Row className={classes.buttonContainer}>
                            <Col lg={5} className={classNames('gap-2', classes.buttonControl)}>
                                <button 
                                    className={classNames(classes.buttonDark, classes.buttonRound, classes.button)}
                                    onClick={onClickOfNewGameButton}
                                    title="Start a new game"
                                >
                                    <span><Play className={classes.icon} /></span>
                                    
                                </button>
                            </Col>
                            <Col lg={{span:"5", offset:"2"}} className={classNames('gap-2', classes.buttonControl)}>
                                <button 
                                    disabled
                                    className={classNames(classes.buttonDarkDisabled, classes.buttonRound, classes.button)}
                                    onClick={()=>{}}
                                    title="Load already saved game"
                                >
                                    <span><span><ArrowClockwise className={classes.icon} /></span></span>
                                </button>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </>
    );
}

export default GameSelector;

