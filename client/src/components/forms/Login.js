import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {setLogin} from "../../store/ProfileSlice";

import styles from "./Login.module.css";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

const Login = () => {

    const [loading,setLoading]=useState(false);

    const [error,setError]=useState(false);

    const dispatch = useDispatch();

    const submitHandler=async(event)=>{

        event.preventDefault();

        setLoading(true);

        const response=await fetch("/api/login",{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: event.target[0].value.trim(),
                pw: event.target[1].value.trim()
            }),
        }).then(res=>res.json());
        
        if(response.message==="FOUND"){
            dispatch(setLogin(response));
        }else if(response.message==="NOT FOUND"){
            setError(true);
        }

        setLoading(false);
    }

    return (
        <Container fluid style={{marginTop:"5vh"}}>
            <Row>
                <Col md={2}/>
                <Col>
                    <form onSubmit={submitHandler} style={{margin:"15px"}}>
                        <div className={styles.login_container}>
                            <div style={{textAlign:"center"}}>
                            <h1>LOGIN</h1>
                                <p>Please enter your credentials to log in to your <b>MAIL-IT</b> account.</p>
                                </div>
                            <hr />

                            <label htmlFor="username"><h4>USERNAME</h4></label>
                            <input type="text" placeholder="Enter Username" name="username" id="username" required />

                            <label htmlFor="psw"><h4>PASSWORD</h4></label>
                            <input type="password" placeholder="Enter Password" name="psw" id="psw" required />
                            
                            {   error && 
                                <div style={{color:"red", fontWeight:"bold", margin:"0 auto 20px"}}>
                                    Invalid Credentials. Please enter matching credentials.
                                </div>
                            }
                            <button type="submit" className={styles.loginbtn} >
                                <h4>
                                {
                                    !loading ?
                                    "LOGIN"
                                    :
                                    <div style={{display:"flex", justifyContent: "center"}}>
                                        <Spinner animation="border" />
                                        &nbsp;LOADING...
                                    </div>
                                }
                                </h4>
                            </button>
                        </div>

                        <div className={styles.register}>
                            <h5>Don't have an account?<br /><Link to="/register">REGISTER</Link></h5>
                        </div>
                    </form>
                </Col>
                <Col md={2}/>
            </Row>
        </Container>
    )
}

export default Login