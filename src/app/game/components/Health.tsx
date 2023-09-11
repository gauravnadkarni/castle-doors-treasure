import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import classes from './Health.module.css';
import classNames from "classnames";
import { PropsWithChildren, SyntheticEvent } from "react";
import { NextPage } from "next";

export interface HealthProps {
    maxHealthValue:number
    currentHealthValue:number
}

const  Health:NextPage<PropsWithChildren<HealthProps>>  = (props:PropsWithChildren<HealthProps>) => {
    const {
        maxHealthValue,
        currentHealthValue,
    } = props

    let perc = (currentHealthValue/maxHealthValue)*100;
    let healthClass = "bg-success";
    if(perc<=60 && perc>20) {
        healthClass="bg-warning";
    } else if(perc<=20) {
        healthClass="bg-danger";
    }
    return (
        <div className={classes.container}>
            <div className={classNames("progress", classes.progressBarVertical)}>
                <div className={classNames("progress-bar",classes.progressBar, healthClass, "progress-bar-striped", "progress-bar-animated")} role="progressbar" aria-valuenow={perc} aria-valuemin={0} aria-valuemax={100} style={{"height": `${perc}%`}}>
                <span className="visually-hidden">{`${perc}%`} Complete</span>
                </div>
            </div>
        </div>
    );
}

export default Health;