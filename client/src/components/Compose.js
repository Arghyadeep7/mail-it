import {useState} from 'react';

import styles from "./Compose.module.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Compose = () => {

    const navigate=useNavigate();

    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(false);

    const {fname,username,lname}=useSelector((state)=>state.profile);

    const request=async(obj)=>{

        setLoading(true);

        const {receiverAdd,sub,msg}=obj;

        const sender=fname+" "+lname;

        const response=await fetch("/api/send",{
            method:"POST",
            headers:{
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sender:sender,
                senderAdd:username,
                receiverAdd:receiverAdd,
                sub:sub,
                msg:msg,
                starred:false
            }),
        }).then(res=>res.json());

        setLoading(false);

        if(response.message==="NOT FOUND"){
            setError(true);
        }else{
            navigate("/sent");
        }
    }

    const submitHandler=async(event)=>{

        event.preventDefault();

        const obj={
            receiverAdd:event.target[0].value,
            sub:event.target[1].value,
            msg:event.target[2].value
        };

        if(event.target[1].value==="" && event.target[2].value===""){
            if(window.confirm("Send this message without a subject or text in the body?")){
                request(obj);
            }
        }else{
            request(obj);
        }
        
    }

    return (
        <Container fluid>
            <form className={styles.compose_container} onSubmit={submitHandler}>
                <div >
                    <Row>
                        <Col md={4}>    
                            <label htmlFor="username"><h5>Receiver Username</h5></label>        
                            <input type="text" placeholder="Enter Username" name="username" id="username" 
                                style={{border:error?"2px solid red":""}}
                                onChange={()=>setError(false)}
                                required />                            
                        </Col>
                        <Col md={8}>
                            <label htmlFor="sub"><h5>Subject</h5></label>
                            <input type="text" placeholder="Enter Subject" name="sub" id="sub"/>
                        </Col>
                        <Col >
                            <label htmlFor="msg"><h5>Body</h5></label>
                            <textarea placeholder="Enter message" style={{minHeight:"45vh"}}></textarea>
                        </Col>
                    </Row>
                    <Row style={{margin:"10px auto"}}>
                        <Col />
                        <Col sm={12} md={10} lg={8}>
                            {
                                error?
                                    <div style={{textAlign:"center", color:"red"}}><b>USERNAME DOES NOT EXIST!</b></div>
                                    :
                                <button type="submit" className={styles.sendbtn} >
                                    <h4>
                                    {
                                        !loading ?
                                        <>
                                            <i className="fa-solid fa-share fa-lg"></i>&nbsp;SEND
                                        </>
                                        :
                                        <div style={{display:"flex", justifyContent: "center"}}>
                                            <Spinner animation="border" />
                                            <h4>&nbsp;LOADING...</h4>
                                        </div>
                                    }  
                                    </h4>
                                </button>
                            } 
                        </Col>
                        <Col />
                    </Row>
                </div>
            </form>
        </Container>
    );
}

export default Compose