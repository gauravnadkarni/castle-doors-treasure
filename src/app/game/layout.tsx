"use client"
import { Col, Container, Row } from "react-bootstrap";
import classes from './layout.module.css';
import { PropsWithChildren, useEffect, useState } from "react";
import { ArrowRight } from 'react-bootstrap-icons';
import { NextPage } from "next";
import { SignOutButton, SignedIn, UserButton } from "@clerk/nextjs";
import Spinner from "@/components/Spinner";

const  Layout:NextPage<PropsWithChildren>  = (props:PropsWithChildren) => {
    const { children } = props;
    const [isReady, setIsReady] = useState(false);
    
    useEffect(()=>{
        setIsReady(true);
    },[])

    return (
        <div className={classes.parentContainer}>
            <Row>
                <Col md={{ span: 11, offset: 0 }}></Col>
                <Col md={1}>
                    <div className={classes.userProfileButton}>
                        {!isReady && <Spinner variant="primary"/>}
                        {isReady && (<SignedIn><UserButton afterSignOutUrl="/"/></SignedIn>)}
                    </div>
                </Col>
            </Row>
            <Row className={classes.userProfileButton}>
                <Col>{children}</Col>
            </Row>
        </div>
    );
}

export default Layout;