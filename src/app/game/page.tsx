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
import MessageBox from "./components/MessageBox";
import BotImageBox from "./components/BotImageBox";
import { useAction } from "convex/react";
import GamePanel from "./components/GamePanel";
import classNames from "classnames";
import LayoutDetail from "./components/LayoutDetail";

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

const OVERLAY_MESSAGE_FOR_MONSTER = "You have been caught by the Monster";
const OVERLAY_MESSAGE_FOR_END_GAME = "You have lost the game";
const OVERLAY_MESSAGE_FOR_SAFE_PASSAGE = "Congratulations!! You have successfully cleared this level";
const OVERLAY_MESSAGE_FOR_TREASURE = "Congratulations!! You have captured this castle";

const MESSAGE_LOGS = {
    "P": "You have received {points} points",
    "M": "Monster!!! Encountered. You have {life} health remaining",
    "S": "Please move forward to the next level",
    "L": "Door is locked and can't be opened.",
    "H": "You have received an extra health",
    "T": "Congratulations!! You have found the treasure in this castle.",
    "T_ALL": "Congratulations!! You have recovered all the treasures of life."
}

const processLayoutData = (layout: Array<Array<string>>):Array<Array<{
    isDoorClosed:boolean
    object:string
    isDoorLocked:boolean
}>> => (
    layout.map((level)=>(level.map((item)=>({
        isDoorClosed:true,
            object: item,
            isDoorLocked: item==='L' ? true : false,
        }
    ))
)));

const getOriginalLayout = (layout: Array<Array<{
    isDoorClosed:boolean
    object:string
    isDoorLocked:boolean
}>>):Array<Array<string>> => (
    layout.map((level)=>(level.map((item)=>(item.object))
)));

const getAutoMessageObject = (
        messageType: 'P' | 'M' | 'S' | 'L' | 'H' | 'T' | 'T_ALL', 
        replace?:{[key: string]:string}
    ):{data:string, formatting?:{[key: string]:string}} => {
        const obj:any = {};
        switch(messageType) {
            case 'P':
                obj.formatting = {'color':'green'}
                break;
            case 'M':
                obj.formatting = {'color':'red'}
                break;
            case 'S':
                obj.formatting = {'color':'green'}
                break;
            case 'L':
                obj.formatting = {'color':'orange'}
                break;
            case 'H':
                obj.formatting = {'color':'yellow'}
                break;
            case 'T':
                obj.formatting = {'color':'green'}
                break;
            case 'T_ALL':
                obj.formatting = {'color':'green'}
                break;
        }
        let data = MESSAGE_LOGS[messageType];
        obj.data = data;
        if(replace) {
            for(let key in replace) {
                data = data.replace(`{${key}}`,replace[key])
            }
            obj.data = data;
        }

        return obj;
    }

const getNewMessageObject = (messages:Array<{data:string, formatting?:{[key: string]:string}}>, type: 'P' | 'M' | 'S' | 'L' | 'H' | 'T' | 'T_ALL' , replace?:{[key: string]:string}):Array<{data:string, formatting?:{[key: string]:string}}> => {
    const newMessages = messages.map((message)=>{
        const data:any = {
            data:message.data,
        };
        if(message.formatting) {
            data.formatting = message.formatting;
        }
        return data;
    });
    newMessages.push(getAutoMessageObject(type, replace));
    return newMessages;
} 

const  Page:NextPage<PropsWithChildren>  = (props:PropsWithChildren) => {
    const router = useRouter();
    const initialLayoutState = {
        currentCastle:1,
        totalCastles:10,
        currentLevel:0,
        totalLevels:8,
        layout:[],
        score:0,
        health:5,
        isLoadingLayout:true,
        isLoadingLevel:true,
        isGameLost:false,
        moveToNextCastle:false,
        isCastleCaptured:false,
        showOverlayOnGame: false,
        overlayMessageOnGame:"",
        autoMessages:[],
    };
    const [isReady, setIsReady] = useState(false);
    const [showQuitGameConfirmationModal, setShowQuitGameConfirmationModal] = useState(false);
    const [showSaveGameConfirmationModal, setSaveGameConfirmationModal] = useState(false);
    const [showLostGameModal, setShowLostGameModal] = useState(false);
    const [castleLayout, setLayout] = useState<{
        currentCastle:number,
        currentLevel:number,
        layout:Array<Array<{
            isDoorClosed:boolean
            object:string
            isDoorLocked:boolean
        }>>,
        score:number,
        health:number,
        totalCastles:number,
        totalLevels:number,
        isLoadingLayout:boolean,
        isLoadingLevel:boolean,
        isGameLost:boolean,
        moveToNextCastle:boolean,
        isCastleCaptured:boolean,
        showOverlayOnGame:boolean,
        overlayMessageOnGame:string,
        autoMessages:Array<{data:string, formatting?:{[key: string]:string}}>,
    }>(initialLayoutState);
    const [chatMessages, setChatMessages] = useState({messages:[]});
    const chat = useAction(api.openai.chat);

    const onQuitGame = (e:SyntheticEvent) => {
        setShowQuitGameConfirmationModal(true);
    }

    const onSaveGame = (e:SyntheticEvent) => {
        setSaveGameConfirmationModal(true);
    }

    const onClickOfDoor = (level:number, index:number) => {
        const obj = castleLayout.layout[level][index];
        if(obj.isDoorLocked===true) {
            setLayout((prevState)=>{
                return {
                    ...prevState,
                    autoMessages: getNewMessageObject(prevState.autoMessages, 'L')
                }
            })
            return;
        }
        const objectType = castleLayout.layout[level][index].object;
        let score = castleLayout.score;
        let health = castleLayout.health;
        let isCastleCaptured = castleLayout.isCastleCaptured;
        let isGameLost = false;
        let currentLevel = castleLayout.currentLevel;
        let currentCastle = castleLayout.currentCastle;
        let showOverlayOnGame = castleLayout.showOverlayOnGame;
        let overlayMessageOnGame = castleLayout.overlayMessageOnGame;
        let autoMessages = castleLayout.autoMessages;
        if(objectType === 'P') {
            let points = castleLayout.currentCastle*(castleLayout.currentLevel+1)*50;
            score+=points;
            autoMessages = getNewMessageObject(castleLayout.autoMessages,'P',{'points':`${points}`})
        } else if(objectType === 'H') {
            if(castleLayout.health<5) {
                health++;
            }
            autoMessages = getNewMessageObject(castleLayout.autoMessages,'H')
        } else if(objectType === 'S') {
            showOverlayOnGame=true;
            if(castleLayout.currentLevel===castleLayout.totalLevels) {
                score=score+(castleLayout.currentCastle*1000);
                if(castleLayout.health<5) {
                    health++;
                }
                isCastleCaptured = true;
                currentCastle++;
                currentLevel=0;
                overlayMessageOnGame = OVERLAY_MESSAGE_FOR_TREASURE;
            } else {
                score=score+(castleLayout.currentCastle*100);
                currentLevel= currentLevel+1;
                overlayMessageOnGame = OVERLAY_MESSAGE_FOR_SAFE_PASSAGE;
            }
            autoMessages = getNewMessageObject(castleLayout.autoMessages,'S');
        } else if(objectType === 'M') {
            health--;
            showOverlayOnGame=true;
            if(health===0) {
                isGameLost = true;
                overlayMessageOnGame = OVERLAY_MESSAGE_FOR_END_GAME;
            } else {
                overlayMessageOnGame = OVERLAY_MESSAGE_FOR_MONSTER;
            }
            autoMessages = getNewMessageObject(castleLayout.autoMessages,'M',{life:`${health}`});
        }

        const deducedStateObject = {
            ...castleLayout,
            layout: castleLayout.layout.map((levelArray, levelIdx)=>{
                return levelArray.map((item, itemIdx)=>{
                    if(levelIdx===level && index === itemIdx) {
                        return {
                            ...item,
                            isDoorClosed:false,
                        }
                    }
                    return item;
                })
            }),
            score,
            health,
            isCastleCaptured,
            isGameLost,
            currentLevel,
            currentCastle,
            showOverlayOnGame:false,
            overlayMessageOnGame:"",
            autoMessages,
        };

        if(showOverlayOnGame === true) {
            setLayout((prevState) => ({
                ...prevState,
                layout: castleLayout.layout.map((levelArray, levelIdx)=>{
                    return levelArray.map((item, itemIdx)=>{
                        if(levelIdx===level && index === itemIdx) {
                            return {
                                ...item,
                                isDoorClosed:false,
                            }
                        }
                        return item;
                    })
                }),
                showOverlayOnGame,
                overlayMessageOnGame,
                autoMessages,
                health,
                score,
                isGameLost,
            }))
            setTimeout(()=> {
                if(isGameLost === true) {
                    router.push('/dashboard');
                    return;
                }
                setLayout((prevState)=>({...prevState, ...deducedStateObject}))
            },5000)
        } else {
            setLayout((prevState)=>({...prevState, ...deducedStateObject}))
        }
    };
    
    useEffect(()=>{
        setIsReady(true);
        chat({messageBody:INSTRUCTIONS.replace("{first}","3").replace("{second}","5").replace("{third}","6")}).then((messageLayout)=>{
            const processedLayout = processLayoutData(messageLayout);
            setLayout({...castleLayout, layout:processedLayout, isLoadingLayout:false, isLoadingLevel:false, totalLevels:messageLayout.length})
        });
    },[]);

    useEffect(()=>{
        setLayout({...castleLayout, isLoadingLayout:true, isLoadingLevel:true});
        chat({messageBody:INSTRUCTIONS.replace("{first}","3").replace("{second}","5").replace("{third}","6")}).then((messageLayout)=>{
            const processedLayout = processLayoutData(messageLayout);
            setLayout({
                ...castleLayout,
                layout:processedLayout,
                isLoadingLayout:false, 
                isLoadingLevel:false, 
                totalLevels:messageLayout.length,
                showOverlayOnGame:false,
                overlayMessageOnGame:"",
            })
        });
    },[castleLayout.currentCastle]);

    useEffect(()=>{
        console.log(castleLayout)
    })

    const {
        score,
        health,
        currentLevel,
        currentCastle,
        totalLevels,
        layout,
        isLoadingLayout,
        isLoadingLevel,
        showOverlayOnGame,
        overlayMessageOnGame,
        autoMessages,
    } = castleLayout;

    return (
        <>
            <div className={classes.parentContainer}>
                <Row className={classes.rowPadding}>
                    <Col lg={1}>
                        <Scorecard score={score}/>
                    </Col>
                    <Col lg={2}>
                        <LayoutDetail castle={currentCastle} level={currentCastle}/>
                    </Col>
                    <Col lg={{span:1, offset:8}}>
                        <div className={classes.healthParent}>
                            {isLoadingLayout && <Spinner variant="primary" size="sm"/>}
                            {!isLoadingLayout && <Health maxHealthValue={5} currentHealthValue={health}/>}
                        </div>
                    </Col>
                </Row>
                <Row className={classNames(classes.rowPadding,classes.gameContentBox)}>
                    <Col lg={1} style={{border:"solid 1px black"}}>
                        {isLoadingLayout && <Spinner variant="primary" size="sm"/>}
                        {!isLoadingLayout && <TreasureRoute currentLevel={currentLevel} totalLevels={totalLevels} statusOfCurrentLevel="pending"/>}
                    </Col>
                    <Col lg={10} className={classes.gamePanel}  style={{border:"solid 1px black"}}>
                        {isLoadingLayout && <Spinner variant="primary" size="sm"/>}
                        {showOverlayOnGame && <div className={classes.overlay}>
                            <div className={classes.overlayMessage}>{overlayMessageOnGame}</div>
                        </div>}
                        {(!isLoadingLayout || !isLoadingLevel) && <GamePanel
                            currentLevel={currentLevel}
                            layoutOfTheLevel={layout[currentLevel]}
                            onClickOfDoor={onClickOfDoor}
                            doorCloseImage=""
                            doorOpenImage=""
                            healthImage=""
                            lockedDoorImage=""
                            monsterImage=""
                            pointsImage=""
                            safePassageImage=""
                        />}
                    </Col>
                </Row>
                <Row className={classes.rowPadding}>
                    <Col lg={6}>
                        <MessageBox content={autoMessages}/>
                    </Col>
                    <Col lg={2}>
                        <BotImageBox imagePath="" altText=""/>
                    </Col>
                </Row>
                <div className={classes.closeButton}>
                    <XSquareFill size={30} color="brown" onClick={onQuitGame} title="End game without saving"/>
                </div>
                <div className={classes.saveButton}>
                    <SaveFill size={30} color="brown" onClick={onSaveGame} title="Save game"/>
                </div>
            </div>
            <Dialog 
                showModal={showQuitGameConfirmationModal}
                confirm={{
                    confirmModal: ()=>{
                        router.push("/dashboard");
                        setShowQuitGameConfirmationModal(false);
                    },
                    confirmModalButtonText: "Quit Game"
                }}
                cancelModal={()=>{
                    setShowQuitGameConfirmationModal(false);
                }}
                cancelModalButtonText="Cancel"
                content="Are you sure about quiting the game?"
                heading="Quit Game??"
            />
            <Dialog 
                showModal={showLostGameModal}
                confirm={{
                    confirmModal: ()=>{
                        router.push("/dashboard");
                        setShowLostGameModal(false);
                    },
                    confirmModalButtonText: "Yes"
                }}
                cancelModal={()=>{
                    setShowLostGameModal(false);
                }}
                cancelModalButtonText="No"
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