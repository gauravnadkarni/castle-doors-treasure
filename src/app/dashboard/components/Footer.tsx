import { Col, Container, Row } from "react-bootstrap";
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { NextPage } from "next";
import { useAuth, useUser } from "@clerk/nextjs";

const  Footer:NextPage<PropsWithChildren>  = (props:PropsWithChildren) => {     
    return (
        <div>Hello</div>
    );
}

export default Footer;