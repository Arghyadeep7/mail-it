import React from 'react';
import {Link} from 'react-router-dom';

import LargeIcon from "../assets/LargeIcon.png";

import styles from "./forms/Register.module.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Default = (props) => {
  return (
    <Container style={{margin:"50px auto",textAlign:"center"}}>
        <Row>
            <div style={{margin:"30px auto"}}>
                <div style={{display:"flex",justifyContent:"center",margin:"30px"}}>
                    <img src={LargeIcon} alt="Icon" style={{height:"10vh"}}/>
                    <b style={{color:"red",fontSize:"7vh",marginLeft:"5px"}}>AIL-IT</b>
                </div>
                <h4 style={{marginBottom:"20px"}}>We <b>MAIL</b>ed-<b>IT</b> for you!</h4>
                <h3>Please visit one of the following <b>MAIL-IT</b> pages.</h3>
            </div>
            <Col />
            <Col md={5} style={{marginBottom:"20px"}}>
                <h5>Don't have an account?</h5>
                <Link to="/register">
                    <button className={styles.registerbtn}><h4>REGISTER</h4></button>
                </Link>
            </Col>
            <Col />
            <Col md={5}>
                <h5>Already have an account?</h5>
                <Link to="/login">
                    <button className={styles.registerbtn}><h4>SIGN IN</h4></button>
                </Link>
            </Col>
            <Col />
        </Row>
    </Container>
  )
}

export default Default;