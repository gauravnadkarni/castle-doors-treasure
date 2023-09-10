import { Button, Card, Col, Container, Row } from "react-bootstrap";
import classes from './GameSelector.module.css';
import classNames from "classnames";
import { PropsWithChildren, SyntheticEvent } from "react";
import { NextPage } from "next";
import { useAuth, useUser } from "@clerk/nextjs";

export interface GameSelectorProps {
    newGameButtonText?: string
    loadGameButtonText?: string
    onClickOfNewGameButton: (e:SyntheticEvent)=>void
    onClickOfLoadGameButton: (e:SyntheticEvent)=>void
}

const  GameSelector:NextPage<PropsWithChildren<GameSelectorProps>>  = (props:PropsWithChildren<GameSelectorProps>) => {
    const {
        newGameButtonText= "New Game",
        loadGameButtonText= "Load Saved Game",
        onClickOfNewGameButton,
        onClickOfLoadGameButton,
    } = props;
    return (
        <>
            <div>Game Options</div>
            <Card>
                <Card.Body>
                    <Container fluid>
                        <Row className={classes.buttonContainer}>
                            <Col lg={12} className={classNames('d-grid','gap-2')}>
                                <Button variant="primary" onClick={onClickOfNewGameButton} size="lg">{newGameButtonText}</Button>
                            </Col>
                        </Row>
                        <Row className={classes.buttonContainer}>
                            <Col lg={12} className={classNames('d-grid','gap-2')}>
                                <Button variant="primary" onClick={onClickOfLoadGameButton} size="lg">{loadGameButtonText}</Button>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </>
    );
}

export default GameSelector;