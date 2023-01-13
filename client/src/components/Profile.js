import {useSelector} from 'react-redux';

import styles from "./Profile.module.css";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Profile = () => {

    const {fname,lname,num,username}=useSelector((state)=>state.profile);

    return (
        <Container fluid>
            <div style={{padding:"25px 0"}}>
            
                <h1 style={{textAlign:"center"}}>PROFILE DETAILS</h1>
                <hr />
                <Row>
                    <Col md={2} />
                    <Col md={4}>
                        <h4>FIRST NAME</h4>
                        <div className={styles.data}>{fname}</div>
                    </Col>
                    <Col md={4}>
                        <h4>LAST NAME</h4>
                        <div className={styles.data}>{lname?lname:"Not Available"}</div>
                    </Col>
                    <Col md={2}>
                    </Col>
                </Row>
                <Row>
                    <Col md={2} />
                    <Col md={4}>
                        <h4>MAIL-IT ADDRESS</h4>
                        <div className={styles.data}>{username}</div>
                    </Col>
                    <Col md={4}>
                        <h4>PHONE NUMBER</h4>
                        <div className={styles.data}>{num?num:"Not Available"}</div>
                    </Col>
                    <Col md={2}>
                    </Col>
                </Row>
            </div>
        </Container>
    )
}

export default Profile