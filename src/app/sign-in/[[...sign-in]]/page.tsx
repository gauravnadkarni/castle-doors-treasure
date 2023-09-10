"use client"
import { SignIn, SignedOut } from "@clerk/nextjs";
import { Col, Container, Row } from "react-bootstrap";
import classes from './page.module.css';
import classNames from "classnames";
import { PropsWithChildren, useEffect, useState } from "react";
import { NextPage } from "next";
import Spinner from "@/components/Spinner";

const APP_TITLE = "Welcome To Castle, Doors and Treasures";

const  SignInPage:NextPage<PropsWithChildren>  = (props:PropsWithChildren) => {
    const [isReady, setIsReady] = useState(false);
    
    useEffect(()=>{
        setIsReady(true);
    },[])
  
    return (
        <Row>
            <Col md={9} lg={9} xl={9} xxl={9}>
                <div className={classes.backgroundCover}>
                    <div className={classNames(classes.header,'col-sm-5','col-md-5','col-lg-5','col-xl-5','col-xxl-5')}>{APP_TITLE}</div>
                </div>
            </Col>
            <Col sm={12} md={3} lg={3} xl={3} xxl={3}>
                <div className={classes.signInControl}>
                    {!isReady && <Spinner variant="primary"/>}
                    {isReady && <SignedOut><SignIn/></SignedOut>}
                </div>
            </Col>
        </Row>
    )
}

export default SignInPage;