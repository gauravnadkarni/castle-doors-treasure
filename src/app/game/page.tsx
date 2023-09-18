"use client"
import { Col, Container, Row } from "react-bootstrap";
import { api } from "../../../convex/_generated/api";
import classes from './page.module.css';
import { PropsWithChildren, SyntheticEvent, useEffect, useState } from "react";
import { NextPage } from "next";
import { SignOutButton, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Spinner from "@/components/Spinner";
import Scorecard from "./components/Scorecard";
import Health from "./components/Health";
import { XSquareFill, SaveFill } from 'react-bootstrap-icons';
import { useRouter } from "next/navigation";
import Dialog from "@/components/Dialog";
import TreasureRoute from "./components/TreasureRoute";
import MessageBox from "./components/MessageBox";
import BotImageBox from "./components/BotImageBox";
import { useAction, useMutation } from "convex/react";
import GamePanel from "./components/GamePanel";
import classNames from "classnames";
import LayoutDetail from "./components/LayoutDetail";
import LayoutProgress from "./components/LayoutProgress";


const FAILSAFE_MATRIX_DATA = [
  ["M", "P", "L", "S", "S"],
  ["S", "S", "M", "L", "M", "P"],
  ["L", "P", "S", "M", "S", "M", "M"],
  ["H", "M", "S", "S", "L", "P", "M", "M", "M"],
  ["P", "L", "M", "M", "S", "M", "L", "S", "P"],
  ["M", "H", "S", "S", "M", "P", "L", "L", "M", "P", "S", "S"],
  ["H", "S", "H", "L", "M", "P", "M", "L", "M", "M", "P", "L", "S"],
  ["M", "P", "S", "L", "L", "S", "M", "S", "P", "M", "M", "L", "P"],
  ["L", "H", "P", "M", "S", "M", "S", "P", "L", "P", "M", "L", "M", "S", "P"],
  ["S", "L", "P", "M", "S", "M", "S", "P", "L", "H", "P", "M", "L", "M", "S"],
];

const INITIAL_INSTRUCTIONS = `Can you give me a two dimensional json array and not program  which satisfies the following conditions? 
- Row with index 0 should start with 5 elements
- There should be 10 rows 
- Each row should have length at least one more than the previous row length
- Elements could be one of the following:'M','P','L', 'S'
- There should always be more number of 'S' than 'M' in rows with index less than 3
- There should always be more number of 'M' than 'S', 'P' or 'L' in rows with index greater than 2 and less than 6
- There should be exactly 2 'S' in the rows with index greater 5
- Each row should have at least one character of each type
- These characters should be placed in random order in a row
- At row with numbers {first},{second} and {third} you can add one H element at any random position
Please give only the array and no explanation`;

const ROTATION_INSTRUCTION = `Can you right rotate and return all the rows in the given two dimensional array by {number}? Please do not give me the program to do this.`

const OVERLAY_MESSAGE_FOR_MONSTER = "You have been caught by the Monster";
const OVERLAY_MESSAGE_FOR_END_GAME = "You have lost the game";
const OVERLAY_MESSAGE_FOR_SAFE_PASSAGE = "Congratulations!! You have successfully cleared this level";
const OVERLAY_MESSAGE_FOR_TREASURE = "Congratulations!! You have captured this castle";

const MESSAGE_LOGS = {
    "P": "You have received {points} points",
    "M": "Monster!!! Encountered. You have {life} health remaining",
    "S": "Please move forward to the next level",
    "L": "Door is blocked and leads to nowhere.",
    "H": "You have received an extra health",
    "T": "Congratulations!! You have found the treasure in this castle.",
    "T_ALL": "Congratulations!! You have recovered all the treasures of life."
}

const BEHIND_DOOR_IMAGE_OBJECT:{[key : string]:{image:string, alt:string}} = {
    'P':{image:'/assets/images/objects/points.png',alt:'Reward'},
    'M':{image:'/assets/images/objects/monster.png',alt:'monster'},
    'L':{image:'/assets/images/objects/wall.png',alt:'wall'},
    'H':{image:'/assets/images/objects/health.png',alt:'health'},
    'S':{image:'/assets/images/objects/passage.png',alt:'safe passage'},
}

const DEFAULT_EMOJI_PATH = "/assets/images/emojis/default.png";

const processLayoutData = (layout: Array<Array<string>>):Array<Array<{
    isDoorClosed:boolean
    object:string
    isDoorBlocked:boolean
    imageBehindDoor:string
    imageBehindDoorAltText:string
}>> => (
    layout.map((level)=>(level.map((item)=>({
            isDoorClosed:true,          
            object: item,                                                                   
            isDoorBlocked: item==='L' ? true : false,
            imageBehindDoor: BEHIND_DOOR_IMAGE_OBJECT[item].image,
            imageBehindDoorAltText: BEHIND_DOOR_IMAGE_OBJECT[item].alt,
        }                   
    ))
)));

const getOriginalLayout = (layout: Array<Array<{
    isDoorClosed:boolean
    object:string
    isDoorBlocked:boolean
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
    const { user } = useUser();
    const initialLayoutState = {
        lostGaurdCounter:0,
        currentCastle:1,  ///1 - initial value
        totalCastles:10,
        currentLevel:0,  //0 - initial value
        totalLevels:9,
        layout:[],
        score:0,
        scorePerCastle:0,
        health:5,
        isLoadingLayout:true,
        isLoadingLevel:true,
        isGameLost:false,
        isCastleCaptured:false,
        areAllCastlesCaptured:false,
        showOverlayOnGame: false,
        overlayMessageOnGame:"",
        autoMessages:[],
        botImagePath:DEFAULT_EMOJI_PATH,
        botImageLoading:false,
    };
    const [isReady, setIsReady] = useState(false);
    const [showQuitGameConfirmationModal, setShowQuitGameConfirmationModal] = useState(false);
    const updateScore = useMutation(api.scores.updateMyScore);
    const [castleLayout, setLayout] = useState<{
        lostGaurdCounter:number,
        currentCastle:number,
        currentLevel:number,
        layout:Array<Array<{
            isDoorClosed:boolean
            object:string
            isDoorBlocked:boolean
            imageBehindDoor:string
            imageBehindDoorAltText:string
        }>>,
        score:number,
        scorePerCastle:number,
        health:number,
        totalCastles:number,
        totalLevels:number,
        isLoadingLayout:boolean,
        isLoadingLevel:boolean,
        isGameLost:boolean,
        isCastleCaptured:boolean,
        showOverlayOnGame:boolean,
        overlayMessageOnGame:string,
        areAllCastlesCaptured:boolean,
        autoMessages:Array<{data:string, formatting?:{[key: string]:string}}>,
        botImagePath:string,
        botImageLoading:boolean
    }>(initialLayoutState);
    const getLayoutAction = useAction(api.logic.getLayout);
    const rotateLayoutAction = useAction(api.logic.getRotatedLayout);
    const getEmotionImageAction = useAction(api.logic.getEmotionImage);

    const onQuitGame = (e:SyntheticEvent) => {
        setShowQuitGameConfirmationModal(true);
    }

    const onClickMoveToNextCastle =() =>{
        const areAllCastlesCaptured = castleLayout.areAllCastlesCaptured;
        if(areAllCastlesCaptured===true) {
            setLayout(initialLayoutState);
            return;
        }
        setLayout((prevState) => ({
            ...prevState,
            currentCastle:prevState.currentCastle+1,
            currentLevel:0,
            layout:[],
            isGameLost:false,
            isLoadingLayout:true, 
            isLoadingLevel:true,
            isCastleCaptured:false,
        }));
    }

    const onClickOfDoor = (level:number, index:number) => {
        const obj = castleLayout.layout[level][index];
        if(obj.isDoorClosed===false) {
            return;
        }
        /*if(obj.isDoorBlocked===true) {
            setLayout((prevState)=>{
                return {
                    ...prevState,
                    autoMessages: getNewMessageObject(prevState.autoMessages, 'L')
                }
            })
            return;
        }*/
        const objectType = castleLayout.layout[level][index].object;
        let score = castleLayout.score;
        let health = castleLayout.health;
        let isCastleCaptured = castleLayout.isCastleCaptured;
        let isGameLost = false;
        let currentLevel = castleLayout.currentLevel;
        let currentCastle = castleLayout.currentCastle;
        let showOverlayOnGame = castleLayout.showOverlayOnGame;
        let overlayMessageOnGame = castleLayout.overlayMessageOnGame;
        let areAllCastlesCaptured =  castleLayout.areAllCastlesCaptured;
        let autoMessages = castleLayout.autoMessages;
        let scorePerCastle = castleLayout.scorePerCastle;
        if(objectType === 'P') {
            let points = castleLayout.currentCastle*(castleLayout.currentLevel+1)*50;
            score+=points;
            scorePerCastle=score;
            autoMessages = getNewMessageObject(castleLayout.autoMessages,'P',{'points':`${points}`})
        } else if(objectType === 'H') {
            if(castleLayout.health<5) {
                health++;
            }
            autoMessages = getNewMessageObject(castleLayout.autoMessages,'H')
        } else if(objectType === 'S') {
            if(castleLayout.currentLevel===castleLayout.totalLevels) {
                score=score+(castleLayout.currentCastle*1000);
                scorePerCastle= score;
                if(castleLayout.health<5) {
                    health++;
                }
                isCastleCaptured = true;
                currentCastle++;
                currentLevel= currentLevel+1;
                overlayMessageOnGame = OVERLAY_MESSAGE_FOR_TREASURE;
                if(castleLayout.currentCastle===castleLayout.totalCastles) {
                    areAllCastlesCaptured =true;
                    autoMessages = getNewMessageObject(castleLayout.autoMessages,'T_ALL');
                } else {
                    autoMessages = getNewMessageObject(castleLayout.autoMessages,'T');
                }
            } else {
                showOverlayOnGame=true;
                score=score+(castleLayout.currentCastle*100);
                scorePerCastle= score;
                currentLevel= currentLevel+1;
                overlayMessageOnGame = OVERLAY_MESSAGE_FOR_SAFE_PASSAGE;
                autoMessages = getNewMessageObject(castleLayout.autoMessages,'S');
            }
            
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
        } else if(objectType === 'L') {
            autoMessages = getNewMessageObject(castleLayout.autoMessages,'L')
        }

        const deducedStateObject = {
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
            scorePerCastle,
            health,
            isCastleCaptured,
            isGameLost,
            currentLevel,
            currentCastle,
            showOverlayOnGame:false,
            overlayMessageOnGame:"",
            autoMessages,
        };
        if(areAllCastlesCaptured===true){
            updateScore({userId: user ? user.id :"", score:BigInt(scorePerCastle)});
            setLayout((prevState) => ({
                ...prevState,
                autoMessages,
                currentCastle,
                currentLevel,//required to show 100% in layout details for level
                isCastleCaptured,
                areAllCastlesCaptured,
                scorePerCastle:0,
            }));
        } else if(isCastleCaptured===true) {
            updateScore({userId: user ? user.id :"", score:BigInt(scorePerCastle)}); // to update the score in the backend after capturing the castle
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
                autoMessages,
                health,
                score,
                scorePerCastle:0,
                currentLevel,//required to show 100% in layout details for level
                isCastleCaptured,
                areAllCastlesCaptured,
            }));
        } else if(isGameLost===true) {
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
                autoMessages,
                scorePerCastle:0,
                isGameLost,
            }));
        } else if(showOverlayOnGame === true) {
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
        console.log(castleLayout)
    });

    useEffect(()=>{
        setLayout({...castleLayout, isLoadingLayout:true, isLoadingLevel:true});
        if(castleLayout.currentCastle===1) {
            getLayoutAction({messageBody:INITIAL_INSTRUCTIONS.replace("{first}","3").replace("{second}","5").replace("{third}","6")}).then((messageLayout)=>{
                const processedLayout = processLayoutData(messageLayout);
                setLayout((prevState)=>({
                    ...castleLayout,
                    layout:processedLayout,
                    isLoadingLayout:false, 
                    isLoadingLevel:false, 
                    totalLevels:messageLayout.length-1,
                    showOverlayOnGame:false,
                    overlayMessageOnGame:"",
                }));
            });
            return;
        }
        const num = Math.random()*10;
        rotateLayoutAction({messageBody:ROTATION_INSTRUCTION.replace("{number}",`${num}`)+` ${JSON.stringify(FAILSAFE_MATRIX_DATA)}`}).then((messageLayout)=>{
            const processedLayout = processLayoutData(messageLayout);
            setLayout((prevState)=>({
                ...castleLayout,
                layout:processedLayout,
                isLoadingLayout:false, 
                isLoadingLevel:false, 
                totalLevels:messageLayout.length-1,
                showOverlayOnGame:false,
                overlayMessageOnGame:"",
            }));
        });
    },[castleLayout.currentCastle, castleLayout.lostGaurdCounter]);

    useEffect(() => {
        if(!castleLayout.autoMessages || castleLayout.autoMessages.length===0) {
            return;
        }
        console.log("I am here")
        setLayout((prevState)=>{
            console.log("I am here 1")
            return {...prevState, botImageLoading: true, botImagePath:""}
        });
        const lastMessageObject = castleLayout.autoMessages[castleLayout.autoMessages.length-1];
        getEmotionImageAction({messageBody:lastMessageObject.data}).then((imagePath:string|null)=>{
            console.log("I am here 2")
            setLayout((prevState)=>{
                console.log("I am here 3")
                return {...prevState, botImagePath: imagePath ? imagePath : DEFAULT_EMOJI_PATH, botImageLoading:false};
            });
        });
    },[castleLayout.autoMessages])

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
        isCastleCaptured,
        areAllCastlesCaptured,
        isGameLost,
        lostGaurdCounter,
        botImageLoading,
        botImagePath,
    } = castleLayout;

    return (
        <>
            <div className={classes.parentContainer}>
                <Row className={classes.rowPadding}>
                    <Col lg={1}>
                        <Scorecard score={score}/>
                    </Col>
                    <Col lg={2}>
                        <LayoutDetail castle={(currentCastle>10)?(10):(currentCastle)} level={((currentLevel+1)>10)?(10):(currentLevel+1)}/>
                    </Col>
                    <Col lg={{span:1, offset:8}}>
                        <div className={classes.healthParent}>
                            {<Health maxHealthValue={5} currentHealthValue={health}/>}
                        </div>
                    </Col>
                </Row>
                <Row className={classNames(classes.rowPadding,classes.gameContentBox)}>
                    {/*<Col lg={1} style={{border:"solid 1px black"}}>
                        {isLoadingLayout && <Spinner variant="primary" size="sm"/>}
                        {!isLoadingLayout && <TreasureRoute currentLevel={currentLevel} totalLevels={totalLevels} statusOfCurrentLevel="pending"/>}
                    </Col>*/}
                    <Col lg={11} className={classNames(classes.gamePanel,{[classes.gradientBackground]:!isCastleCaptured},{[classes.blackBackground]:isCastleCaptured})}  style={{border:"solid 1px black"}}>
                        {isLoadingLayout && <div className={classes.centerSpinner}><Spinner variant="secondary"/></div>}
                        {showOverlayOnGame && <div className={classes.overlay}>
                            <div className={classes.overlayMessage}>{overlayMessageOnGame}</div>
                        </div>}
                        {(!isLoadingLayout || !isLoadingLevel) && <GamePanel
                            currentLevel={currentLevel}
                            layoutOfTheLevel={layout[currentLevel]}
                            onClickOfDoor={onClickOfDoor}
                            showImageOnPanel={isCastleCaptured}
                            imageOnPanelPath="/assets/images/objects/treasure.png"
                            imageOnPanelAltText="Treasure"
                            imageOnPanelText={((areAllCastlesCaptured===true) ? ("You have found all the gold."):("You have found the treasure."))}
                            imageOnPanelButtonText={((areAllCastlesCaptured===true) ? ("Click to play again"):("Go to the next Castle"))}
                            imageOnPanelOnClick={onClickMoveToNextCastle}
                        />}
                    </Col>
                </Row>
                <Row className={classes.rowPadding}>
                    <Col lg={4}>
                        <LayoutProgress castle={{minCastle:0,maxCastle:10,currentCastle:currentCastle-1}} level={{minLevel:0, maxLevel:10, currentLevel: currentLevel}}/>
                    </Col>
                    <Col lg={5}>
                        <MessageBox content={autoMessages}/>
                    </Col>
                    <Col lg={2}>
                        <BotImageBox imagePath={botImagePath} isLoading={botImageLoading} altText="image"/>
                    </Col>
                </Row>
                <div className={classes.closeButton}>
                    <XSquareFill size={30} color="brown" onClick={onQuitGame} title="End game without saving"/>
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
                showModal={isGameLost}
                confirm={{
                    confirmModal: ()=>{
                        router.push("/dashboard");
                    },
                    confirmModalButtonText: "Yes"
                }}
                cancelModal={()=>{
                    setLayout(()=>({...initialLayoutState,lostGaurdCounter:lostGaurdCounter+1}));
                }}
                cancelModalButtonText="No"
                content="Are you sure about ending the game?"
                heading="End Game??"
            />
        </>
    );
}

export default Page;