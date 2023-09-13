import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import classes from './MessageBox.module.css';
import classNames from "classnames";
import React, { PropsWithChildren, SyntheticEvent, useEffect, useRef } from "react";
import { NextPage } from "next";

export interface MessageBoxProps {
    content:Array<{data:string, formatting?:{[key: string]:string}}>
}

const getStyleObject = (formatting:{[key: string]:string}) => {
    const obj:any = {};
    if(formatting && Object.keys(formatting).length!==0) {
        for(let key in formatting) {
            if(key === 'color') {
                obj.color = formatting[key]
            } else if (key === 'bold') {
                obj.bold = formatting[key]
            } else if (key === 'fontSize') {
                obj.fontSize = formatting[key]
            } else if (key === 'fontWeight') {
                obj.fontWeight = formatting[key]
            } 
        }
    }
    return obj;
}

const  MessageBox:NextPage<PropsWithChildren<MessageBoxProps>>  = (props:PropsWithChildren<MessageBoxProps>) => {
    const lastDivRef = useRef<null | HTMLDivElement>(null);
    const {
        content,
    } = props

    useEffect(() => {
        if(lastDivRef && lastDivRef.current) {
            lastDivRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    })
    
    return (
        <div className={classes.container}>
            {content && content.map((data, idx)=>(<div key={`idx-${idx}`} ref={(idx+1===content.length) ? lastDivRef : null} style={data.formatting && getStyleObject(data.formatting)}>
                {data.data}
            </div>))}
        </div>
    );
}

export default MessageBox;