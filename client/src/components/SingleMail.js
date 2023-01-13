import {useState} from 'react';
import {Link} from 'react-router-dom';

import styles from "./SingleMail.module.css";
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const SingleMail = (props) => {

    const {sender,senderAdd,receiver,receiverAdd,sub,msg,starred,stat,dateObj,_id}=props.mail;
    const {date,month,year,hour,minute}=dateObj;

    const [star, setStar]=useState(starred);

    const handler=async (url)=>{

        const obj={
            _id:props.mail._id,
            username:props.username
        };

        if(url==="/api/star"){
            obj.starred=!star;
        }

        const response=await fetch(url,{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj),
        }).then(res=>res.json());

        if(response.message==="SUCCESSFUL!"){
            
            if(url==="/api/star"){
                setStar(!star);
            }else{
                window.location.reload(true);
            }
            
        }else{
            alert("Some error has occurred.\nPlease try again later.");
        }

    }

    return (
        <Link to={_id} className={styles.link}>
            <Row className={styles.container} style={{background:stat==="NEW"?"white":"whitesmoke"}}>
                <Col xs={5} md={2}>
                    <div className={styles.wrap}>{props.type==="sent"?receiver:sender}</div>
                    <div className={styles.wrap}><u style={{fontSize:"12px",color:"blue"}}>{props.type==="sent"?receiverAdd:senderAdd}</u></div>
                </Col>
                <Col md={6} className={styles.subject}>
                    <div className={styles.wrap} style={{color:"red"}}>
                        {sub?sub:<i>(No Subject)</i>}
                    </div>
                    <div className={styles.wrap} style={{fontSize:"12px"}}>
                        <i>{msg?msg:"(No message)"}</i>
                    </div>
                </Col>
                <Col xs={2} md={1} style={{textAlign:"center",marginTop:"14px", color:"red", fontStyle: "italic"}}>
                    { props.type!=="sent" && stat==="SENT" && <h6 >SENT</h6>}
                    { stat==="NEW" && <Badge bg="danger" >NEW</Badge>}
                </Col>
                <Col xs={3} md={2} style={{textAlign:"center"}}>
                    <span style={{fontSize:"12px"}}>{date}/{month}/{year}</span><br />
                    <span style={{fontSize:"12px"}}>{hour}:{minute}</span>
                </Col>
                
                <Col xs={2} md={1} style={{display:"flex", justifyContent:'center'}}>
                    <Link className={styles.btn} style={{color:'red'}} onClick={()=>handler("/api/delete")}><i className="fa-solid fa-trash-can"></i></Link>
                    <Link className={styles.btn} style={{color:'gold'}} onClick={()=>handler("/api/star")}><i className={`fa-${star?'solid':'regular'} fa-star`}></i></Link>
                </Col>
            </Row>
        </Link>
    );
}

export default SingleMail