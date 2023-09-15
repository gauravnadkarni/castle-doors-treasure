import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import classes from './NewDoor.module.css';
import { PropsWithChildren, SyntheticEvent } from "react";
import { NextPage } from "next";
import classNames from "classnames";

export interface NewDoorProps {
    onDoorClick:(e:SyntheticEvent)=>void
    isDoorClosed:boolean
    objectImagePath?:string
    objectImageAlt?:string
}

const SHAPE_ROW_COUNT = 3;

const  NewDoor:NextPage<PropsWithChildren<NewDoorProps>>  = (props:PropsWithChildren<NewDoorProps>) => {
    const {
        onDoorClick,
        isDoorClosed,
        objectImagePath,
        objectImageAlt,
    } =  props;

    return (
        <div className={classes.wrapper} onClick={(e)=>{
                onDoorClick(e);
            }}>
            {(objectImagePath && objectImageAlt) && <img src={objectImagePath} alt={objectImageAlt} className={classes.image}/>}
            <div className={classNames(classes.door,classes.leftDoor,{[classes.leftDoorOpen]:!isDoorClosed})}>
                {new Array(SHAPE_ROW_COUNT).fill(0).map((obj, idx)=>(<div key={`idx-${idx}`} className={classes.shapeRow}>
                    <div className={classes.shape}></div>
                    <div className={classes.shape}></div>
                    <div className={classes.shape}></div>
                    <div className={classes.shape}></div>
                </div>))}
                <div className={classNames(classes.knob,classes.leftKnob,{[classes.hideDoorKnob]:!isDoorClosed})}></div>
            </div>
            <div className={classNames(classes.door,classes.rightDoor,{[classes.rightDoorOpen]:!isDoorClosed})}>
                {new Array(SHAPE_ROW_COUNT).fill(0).map((obj, idx)=>(<div key={`idx-${idx}`} className={classes.shapeRow}>
                    <div className={classes.shape}></div>
                    <div className={classes.shape}></div>
                    <div className={classes.shape}></div>
                    <div className={classes.shape}></div>
                </div>))}
                <div className={classNames(classes.knob,classes.rightKnob,{[classes.hideDoorKnob]:!isDoorClosed})}></div>
            </div>
        </div>
    )
}

export default NewDoor;