import { PropsWithChildren, SyntheticEvent } from "react";
import { NextPage } from "next";
import classes from "./GamePanel.module.css";
import { Button, Col, Row } from "react-bootstrap";
import Door from "./Door";
import classNames from "classnames";
import NewDoor from "./NewDoor";

export interface GamePanelProps {
    currentLevel:number,
    layoutOfTheLevel:Array<{
        isDoorClosed:boolean
        object:string
        isDoorBlocked:boolean
        imageBehindDoor:string
        imageBehindDoorAltText:string
    }>
    onClickOfDoor:(level:number,index:number)=>void
    showImageOnPanel:boolean
    imageOnPanelPath:string
    imageOnPanelAltText:string
    imageOnPanelText:string
    imageOnPanelButtonText:string
    imageOnPanelOnClick:()=>void
} 

const GamePanel:NextPage<PropsWithChildren<GamePanelProps>> = (props:PropsWithChildren<GamePanelProps>) => {
    const {
        currentLevel,
        layoutOfTheLevel,
        onClickOfDoor,
        showImageOnPanel,
        imageOnPanelPath,
        imageOnPanelAltText,
        imageOnPanelText,
        imageOnPanelButtonText,
        imageOnPanelOnClick,
    } = props;
    
    return (<Row className={classNames(classes.container, {[classes.blackBackground]:showImageOnPanel})}>
        {!showImageOnPanel &&<Col lg={12} className={classes.doorContainer}> 
        {/*layoutOfTheLevel.map((item, idx)=>(
            <Door key={`idx-${idx}`} isDoorClosed={item.isDoorClosed} isDoorLocked={item.isDoorLocked} onDoorClick={()=>{
                onClickOfDoor(currentLevel,idx)
            }}>
                <div>{item.object}</div>
            </Door>
        ))*/}
        {layoutOfTheLevel.map((item, idx)=>(
            <NewDoor 
                key={`idx-${idx}`} 
                isDoorClosed={item.isDoorClosed} 
                onDoorClick={()=>{
                    onClickOfDoor(currentLevel,idx)
                }}
                objectImagePath={item.imageBehindDoor}
                objectImageAlt={item.imageBehindDoorAltText}
            >
                <div>{item.object}</div>
            </NewDoor>
        ))}
         </Col>}
         {showImageOnPanel && <Col lg={12} className={classes.imageContainer}>
                <img src={imageOnPanelPath} alt={imageOnPanelAltText}/>
                <div className={classes.imagePanelText}>{imageOnPanelText}</div>
                <Button variant="secondary" onClick={imageOnPanelOnClick}>{imageOnPanelButtonText}</Button>
        </Col>}
    </Row>);
}

export default GamePanel;