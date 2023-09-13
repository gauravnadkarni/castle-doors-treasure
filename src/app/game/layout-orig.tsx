"use client"
import { Col, Container, Row } from "react-bootstrap";
import classes from './layout.module.css';
import { PropsWithChildren, SyntheticEvent, useEffect, useState } from "react";
import { ArrowRight } from 'react-bootstrap-icons';
import { NextPage } from "next";
import { SignOutButton, SignedIn, UserButton } from "@clerk/nextjs";
import Spinner from "@/components/Spinner";
import Scorecard from "./components/Scorecard";
import Health from "./components/Health";
import { XSquareFill } from 'react-bootstrap-icons';
import { useRouter } from "next/navigation";
import Dialog from "@/components/Dialog";
import TreasureRoute from "./components/TreasureRoute";
import BotMessageBox from "./components/MessageBox";
import BotImageBox from "./components/BotImageBox";

const CONTENT = [{
    data:"Hellow, How are you?"
},{
    data:"Hellow, How are you?"
},{
    data:"Hellow, How are you?"
},{
    data:"Hellow, How are you?"
},{
    data:"Hellow, How are you?"
},{
    data:"Hellow, How are you?"
},]   

const  Layout:NextPage<PropsWithChildren>  = (props:PropsWithChildren) => {
    const { children } = props;
    const [isReady, setIsReady] = useState(false);
    const [isEndGame, setShowGameEndConfirmationModal] = useState(false);
    const router = useRouter();

    const onCloseGame = (e:SyntheticEvent) => {
        setShowGameEndConfirmationModal(true);
    }
    
    useEffect(()=>{
        setIsReady(true);
    },[])

    return (
        <>
            <div className={classes.parentContainer}>
                <Row className={classes.rowPadding}>
                    <Col lg={1}>
                        <Scorecard score={20}/>
                    </Col>
                    <Col lg={{span:1, offset:10}}  style={{}}>
                        <div className={classes.healthParent}>
                            <Health maxHealthValue={5} currentHealthValue={4}/>
                        </div>
                    </Col>
                </Row>
                <Row className={classes.rowPadding}>
                    <Col lg={1}>
                        <TreasureRoute />
                    </Col>
                    <Col lg={10}  style={{border:"solid 1px black"}}>
                        
                    </Col>
                </Row>
                <Row className={classes.rowPadding}>
                    <Col lg={6}>
                        <BotMessageBox content={CONTENT}/>
                    </Col>
                    <Col lg={2}>
                        <BotImageBox imagePath="" altText=""/>
                    </Col>
                </Row>
                <div className={classes.closeButton}>
                    <XSquareFill size={30} color="brown" onClick={onCloseGame}/>
                </div>
            </div>
            <Dialog 
                showModal={isEndGame}
                confirmModal={()=>{
                    router.push("/dashboard");
                    setShowGameEndConfirmationModal(false);
                }}
                cancelModal={()=>{
                    setShowGameEndConfirmationModal(false);
                }}
                cancelModalButtonText="Cancel"
                confirmModalButtonText="End Game"
                content="Are you sure about ending the game?"
                heading="End Game??"
            />
        </>
    );
}

export default Layout;