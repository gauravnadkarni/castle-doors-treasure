"use client"
import { Col, Container, Row } from "react-bootstrap";
import { api } from "../../../convex/_generated/api";
import classes from './page.module.css';
import { PropsWithChildren, SyntheticEvent, useEffect, useState } from "react";
import { NextPage } from "next";
import { SignOutButton, SignedIn, UserButton } from "@clerk/nextjs";
import Spinner from "@/components/Spinner";
import Scorecard from "./components/Scorecard";
import Health from "./components/Health";
import { XSquareFill, SaveFill } from 'react-bootstrap-icons';
import { useRouter } from "next/navigation";
import Dialog from "@/components/Dialog";
import TreasureRoute from "./components/TreasureRoute";
import BotMessageBox from "./components/BotMessageBox";
import BotImageBox from "./components/BotImageBox";
import { useAction } from "convex/react";

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
},];


const INSTRUCTIONS = `Can you give me a two dimensional json array which satisfies the following conditions? 
- Row with index 0 should start with 5 elements
- There should be 10 rows 
- Each row should have length one more than the previous row length
- Elements could be one of the following:'M','P','L', 'S'
- There should always be more number of 'S' than 'M' in rows with index less than 3
- There should always be more number of 'M' than 'S', 'P' or 'L' in rows with index greater than 2 and less than 6
- There should be exactly 2 'S' in the rows with index greater 5
- Each row should have at least one character of each type
- These characters should be placed in random order in a row
- At row with indices {first},{second} and {third}  you can add one H element at any random position`;

const  Page:NextPage<PropsWithChildren>  = (props:PropsWithChildren) => {
    const [isReady, setIsReady] = useState(false);
    const [showEndGameConfirmationModal, setShowGameEndConfirmationModal] = useState(false);
    const [showSaveGameConfirmationModal, setSaveGameConfirmationModal] = useState(false);
    const [castleLayout, setLayout] = useState<{
        currentCastle:number,
        currentLevel:number,
        layout:null | Array<Array<string>>,
        score:number,
        health:number,
        totalCastles:number,
        totalLevels:number,
        isLoadingLayout:boolean,
    }>({
        currentCastle:1,
        totalCastles:10,
        currentLevel:1,
        totalLevels:8,
        layout:null,
        score:0,
        health:5,
        isLoadingLayout:true,
    });
    const [chatMessages, setChatMessages] = useState({messages:[]});
    const chat = useAction(api.openai.chat);
    const router = useRouter();

    const onCloseGame = (e:SyntheticEvent) => {
        setShowGameEndConfirmationModal(true);
    }

    const onSaveGame = (e:SyntheticEvent) => {
        setSaveGameConfirmationModal(true);
    }
    
    useEffect(()=>{
        setIsReady(true);
        chat({messageBody:INSTRUCTIONS.replace("{first}","3").replace("{second}","5").replace("{third}","6")}).then((messageLayout)=>{
            setLayout({...castleLayout, layout:messageLayout, isLoadingLayout:false, totalLevels:messageLayout.length})
        });
    },[])

    const {
        score,
        health,
        currentLevel,
        totalLevels,
    } = castleLayout

    return (
        <>
            <div className={classes.parentContainer}>
                <Row className={classes.rowPadding}>
                    <Col lg={1}>
                        <Scorecard score={score}/>
                    </Col>
                    <Col lg={{span:1, offset:10}}  style={{}}>
                        <div className={classes.healthParent}>
                            <Health maxHealthValue={5} currentHealthValue={health}/>
                        </div>
                    </Col>
                </Row>
                <Row className={classes.rowPadding}>
                    <Col lg={1}>
                        <TreasureRoute currentLevel={currentLevel} totalLevels={totalLevels} statusOfCurrentLevel="pending"/>
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
                    <XSquareFill size={30} color="brown" onClick={onCloseGame} title="End game without saving"/>
                </div>
                <div className={classes.saveButton}>
                    <SaveFill size={30} color="brown" onClick={onSaveGame} title="Save game"/>
                </div>
            </div>
            <Dialog 
                showModal={showEndGameConfirmationModal}
                confirm={{
                    confirmModal: ()=>{
                        router.push("/dashboard");
                        setShowGameEndConfirmationModal(false);
                    },
                    confirmModalButtonText: "End Game"
                }}
                cancelModal={()=>{
                    setShowGameEndConfirmationModal(false);
                }}
                cancelModalButtonText="Cancel"
                content="Are you sure about ending the game?"
                heading="End Game??"
            />
            <Dialog 
                showModal={showSaveGameConfirmationModal}
                cancelModal={()=>{
                    setSaveGameConfirmationModal(false);
                }}
                cancelModalButtonText="Ok"
                content="Your game has been saved. Please not that you will be able to load the game from the first level of the current catle only."
                heading="Saving Game"
            />
        </>
    );
}

export default Page;