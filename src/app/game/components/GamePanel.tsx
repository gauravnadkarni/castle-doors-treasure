import { PropsWithChildren, SyntheticEvent } from "react";
import { NextPage } from "next";
import classes from "./GamePanel.module.css";
import { Col, Row } from "react-bootstrap";
import Door from "./Door";
import classNames from "classnames";

export interface GamePanelProps {
    currentLevel:number,
    layoutOfTheLevel:Array<{
        isDoorClosed:boolean
        object:string
        isDoorLocked:boolean
    }>
    onClickOfDoor:(level:number,index:number)=>void
    doorOpenImage:string
    doorCloseImage:string
    monsterImage:string
    pointsImage:string
    healthImage:string
    lockedDoorImage:string
    safePassageImage:string
} 

const GamePanel:NextPage<PropsWithChildren<GamePanelProps>> = (props:PropsWithChildren<GamePanelProps>) => {
    const {
        currentLevel,
        layoutOfTheLevel,
        onClickOfDoor,   
        doorOpenImage,
        doorCloseImage,
        monsterImage,
        pointsImage,
        healthImage,
        lockedDoorImage,
        safePassageImage,
    } = props;

    let lgDoorSize:number = 1;
    if(layoutOfTheLevel.length<=5) {
        lgDoorSize = 2;
    } else if(layoutOfTheLevel.length<10) {
        lgDoorSize = 4;
    }
    return (<Row className={classes.container}>
        <Col lg={12} className={classes.doorContainer}> 
        {layoutOfTheLevel.map((item, idx)=>(
            <Door key={`idx-${idx}`} isDoorClosed={item.isDoorClosed} isDoorLocked={item.isDoorLocked} onDoorClick={()=>{
                onClickOfDoor(currentLevel,idx)
            }}>
                <div>{item.object}</div>
            </Door>
        ))}
         </Col>
    </Row>);
}

export default GamePanel;