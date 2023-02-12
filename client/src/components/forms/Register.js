import {useState,useRef} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';

import {setLogin} from "../../store/ProfileSlice";

import styles from "./Register.module.css";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

const Register = () => {

  const dispatch=useDispatch();

  function onlyLettersAndSpaces(str) {
    return /^[A-Z a-z \s]*$/.test(str);
  }

  const fnameRef=useRef();
  const [fnameError,setFName]=useState(false);

  const fnameHandler=()=>{
    setFName(!onlyLettersAndSpaces(fnameRef.current.value));
  }

  const lnameRef=useRef();
  const [lnameError,setLName]=useState(false);

  const lnameHandler=()=>{
    setLName(!onlyLettersAndSpaces(lnameRef.current.value));
  }

  const numRef=useRef();
  const [numError,setNum]=useState(false);

  const numHandler=()=>{
    
    setNum(numRef.current.value.length!==0 
      && (numRef.current.value.length!==10 || /^\d*$/.test(numRef.current.value)===false));
  }

  const usernameRef=useRef();
  const [usernameError,setUsername]=useState(false);
  const [checkError,setCheck]=useState("");
  const [checkLoad,setCheckLoad]=useState(false);

  const usernameHandler=()=>{
    setUsername(usernameRef.current.value.length!==0 && 
      (usernameRef.current.value.includes(' ') || /^[a-z A-Z]+/.test(usernameRef.current.value)===false));

    setCheck("");
  }

  const request=async(obj)=>{
    const response=await fetch("/api/register",{
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(obj),
    }).then(res=>res.json());

    return response;
  }

  const checkHandler=async()=>{
    if(!usernameError && usernameRef.current.value){

      setCheckLoad(true);

      const response=await request({
        username:usernameRef.current.value,
        type:"SEARCH"
      });

      setCheck(response.message);

      setCheckLoad(false);
      
    }else if(usernameRef.current.value===""){
      setCheck("");
    }
  };

  const pwRef=useRef();
  const [pwError,setPw]=useState(false);

  const pwHandler=()=>{
    setPw( pwRef.current.value.length!==0 && ( /[!,@,#,$,%,^,&,*]+/.test(pwRef.current.value)===false
    || pwRef.current.value.length<8 || /\d/.test(pwRef.current.value)===false
    || /[A-Z]+/.test(pwRef.current.value)===false) );

    if(pwRef.current.value!==confirmPWRef.current.value && confirmPWRef.current.value){
      setConfirmPW(true);
    }else if(pwRef.current.value===confirmPWRef.current.value && confirmPWError){
      setConfirmPW(false);
    }
  }

  const confirmPWRef=useRef();
  const [confirmPWError,setConfirmPW]=useState(false);

  const confirmPWHandler=()=>{
    setConfirmPW(confirmPWRef.current.value!=="" && pwRef.current.value!==confirmPWRef.current.value);
  };

  const [submitLoad,setSubmitLoad]=useState(false);

  const submitHandler=async (event)=>{

      event.preventDefault();
      
      setSubmitLoad(true);

      const obj={
        username:usernameRef.current.value.trim(),
        fname:fnameRef.current.value.trim(),
        lname:lnameRef.current.value.trim(),
        num:numRef.current.value.trim(),
        pw:pwRef.current.value.trim(),
        type:"SUBMIT"
      };

      const response=await request(obj);

      setSubmitLoad(false);

      if(response.message==="USER REGISTRATION SUCCESSFUL"){

        const res=await fetch("/api/login",{
          method: "POST",
          headers:{
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              username: obj.username,
              pw: obj.pw
          }),
        }).then(res=>res.json());

        if(res.message==="ERROR"){
          alert("Some error has occurred!\nPlease try again later.")
        }else if(res.message==="FOUND"){
          dispatch(setLogin(response));
        }

      }else if(response.message==="ERROR"){
        alert("Some error has occurred!\nPlease try again later.")
      }else if(response.message==="FOUND"){
        setCheck("FOUND");
      }
      
  };

  return (
    <Container fluid style={{margin:"40px auto"}}>
      <div style={{textAlign:"center", }}>
        <h1>REGISTER</h1>
        <p>Please fill in this form to create a <b>MAIL-IT</b> account.</p>
        <hr />
      </div>
      <form method="POST" onSubmit={submitHandler}>
        <Row>
          <Col md={4}>
            <label htmlFor="fname"><h4>FIRST NAME*</h4></label>
            {
              fnameError && <b style={{color: 'red'}}><br />First name can only contain letters!<br/></b>
            }
            <input type="text" placeholder="Enter First Name" name="fname" id="fname"
              ref={fnameRef} 
              onChange={fnameHandler} 
              style={{border:fnameError?"2px solid red":""}}
              required />

            <label htmlFor="lname"><h4>LAST NAME</h4></label>
            {
              lnameError && <b style={{color: 'red'}}><br />Last name can only contain letters!<br/></b>
            }
            <input type="text" placeholder="Enter Last Name" name="lname" id="lname"
              ref={lnameRef}
              onChange={lnameHandler} 
              style={{border:lnameError?"2px solid red":""}}
              />

            <label htmlFor="num"><h4>PHONE NUMBER</h4></label>
            {
              numError && <b style={{color: 'red'}}><br />Ph. number must contain 10 digits only!<br/></b>
            }
            <input type="text" placeholder="Enter Ph. Number (10 digits)" name="num" id="num"
              ref={numRef}
              onChange={numHandler}
              style={{border:numError?"2px solid red":""}}
              />

          </Col>
          <Col md={4}>
            <span style={{display:"flex",justifyContent:"space-between"}}>
              <label htmlFor="username"><h4>USERNAME*</h4></label>
              {!usernameError && 
                <Button variant="primary" onClick={checkHandler} >
                  {checkLoad?
                    <>
                    <Spinner animation="border" size="sm"/>
                    </>
                    :
                    "CHECK"
                  }
                </Button>
              }
            </span>
            {/* {
              usernameError && <b style={{color: 'red'}}>Please follow given username guidelines!<br/></b>
            } */}
            {
              !usernameError && checkError==="FOUND" && <b style={{color: 'red'}}>Username already exists! Try a different one.<br/></b>
            }
            {
              !usernameError && checkError==="NOT FOUND" && <b style={{color: 'green'}}>Username is available!<br/></b>
            }
            <input type="text" placeholder="Enter USERNAME" name="username" id="username" 
              ref={usernameRef}
              onChange={usernameHandler}
              style={{border:usernameError || checkError==="FOUND"?"2px solid red":""}}
              required />

            <label htmlFor="pw"><h4>PASSWORD*</h4></label>
            {/* {
              pwError && <b style={{color: 'red'}}><br />Please follow given password guidelines!<br/></b>
            } */}
            <input type="password" placeholder="Enter Password" name="pw" id="pw"
              ref={pwRef}
              onChange={pwHandler}
              style={{border:pwError?"2px solid red":""}}
              required />

            <label htmlFor="confirmPW"><h4>CONFIRM PASSWORD*</h4></label>
            {
              confirmPWError && <b style={{color: 'red'}}><br />Passwords do not match!<br/></b>
            }
            <input type="password" placeholder="Confirm Password" name="confirmPW" id="confirmPW" 
              ref={confirmPWRef}
              onChange={confirmPWHandler}
              style={{border:confirmPWError?"2px solid red":""}}
              required />

          </Col>
          <Col md={4}>
            <h6>
              <ul style={{margin:"20px auto",color:usernameError?"red":"black"}}>
                <li>Username must start with a letter!</li>
                <li>Username must not contain any whitespaces!</li>
              </ul>
              <ul style={{margin:"20px auto",color:pwError?"red":"black"}}>
                <hr />
                <li>Password must be atleast 8 characters long!</li>
                <li>Password must contain atleast 1 digit!</li>
                <li>Password must contain atleast one special symbol(!,@,#,$,%,^,&,*)!</li>
                <li>Password must contain atleast 1 uppercase letter!</li>
              </ul>
            </h6>
            {
              !fnameError && !lnameError && !numError && !usernameError && !pwError
              && !confirmPWError && checkError!=="FOUND" &&
              
              <button type="submit" className={styles.registerbtn} disabled={submitLoad}>
                <h4>
                {
                  !submitLoad ?
                  "REGISTER"
                  :
                  <div style={{display:"flex", justifyContent: "center"}}>
                    <Spinner animation="border" />
                    &nbsp;LOADING...
                  </div>
                }
                </h4>
              </button>  
            }
            {
              (fnameError || lnameError || numError || usernameError || checkError==="FOUND" || pwError || confirmPWError) &&
              <h6 style={{color: 'red',textAlign:'center'}}>Please correct the given field(s) to proceed!</h6>
            }
              
            <div className={styles.signin}>
              <h5>Already have an account?<br /><Link to="/login">SIGN IN</Link></h5>
            </div>
          </Col>
        </Row>
      </form>
    </Container>
  )
}

export default Register