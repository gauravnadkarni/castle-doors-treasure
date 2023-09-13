import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import classes from './Door.module.css';
import classNames from "classnames";
import { PropsWithChildren, SyntheticEvent } from "react";
import { NextPage } from "next";

export interface DoorProps {
    onDoorClick:(e:SyntheticEvent)=>void
    isDoorClosed:boolean
    isDoorLocked:boolean
}

const  Door:NextPage<PropsWithChildren<DoorProps>>  = (props:PropsWithChildren<DoorProps>) => {
    const {
        children,
        onDoorClick,
        isDoorClosed,
        isDoorLocked,
    } =  props;

    return (
        <div className={classes.doorFrame}>
            <div className={classes.objectBehindDoor}>
                {children}
            </div>
            <div className={classNames(classes.door,{[classes.openedDoor]:!isDoorClosed})} onClick={(e)=>{
                onDoorClick(e);
            }} title="Open the Door">
            </div>
        </div>
    )
}

export default Door;