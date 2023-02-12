import {useState,useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import SingleMail from "./SingleMail";

const List = (props) => {

    const username=useSelector((state)=>state.profile.username);

    const [loading,setLoading]=useState(false);

    const [data,setData]=useState([]);

    const request=async()=>{
        
        setData([]);

        setLoading(true);

        const response=await fetch("/api/get",{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username
            }),
        }).then(res=>res.json());

        if(props.type==="inbox"){
            
            const mails=response.mails.filter((mail)=>{
                return mail.stat!=="SENT";
            });

            setData(mails);
        }else if(props.type==="sent"){
            const mails=response.mails.filter((mail)=>{
                return mail.stat==="SENT";
            });

            setData(mails);
        }else{
            const mails=response.mails.filter((mail)=>{
                return mail.starred;
            });

            setData(mails);
        }

        setLoading(false);
    };

    const deleteHandler=async()=>{

        const ids=data.map((mail)=>{
            return mail._id;
        });

        const response=await fetch("/api/delete",{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                ids:ids
            }),
        }).then(res=>res.json());

        if(response.message==="SUCCESSFUL"){
            setData([]);
            // window.location.reload(true);
        }else{
            alert("Some error occurred!\nPlease try again later.");
        }
    }

    useEffect(()=>{
        request();
    },[props.type]);

    return (
        <Container fluid>
            
            {!loading && data.length!==0 &&
                <div style={{display:"flex", justifyContent:"space-between"}}>
                    <div style={{margin:"10px auto"}}><b><i style={{textTransform:"uppercase"}}>{props.type} MAILS: {data.length}</i></b></div>
                    <Link style={{margin:"10px auto", textDecoration:"none"}} onClick={deleteHandler}>
                        <b>
                            <i style={{color:"red"}}><i className="fa-solid fa-trash-can"></i> DELETE ALL</i>
                        </b>
                    </Link>
                </div>
            }
            
            {
                data.map((mail)=>(
                    <SingleMail mail={mail} key={mail._id} username={username} type={props.type}/>
                ))
            }
            <h3 style={{textAlign: 'center', margin:"30px"}}>
                {
                    loading && <>Loading {props.type} mails...</>
                }
                {
                    !loading && data.length===0 && 
                    <>
                        No {props.type} mails!
                    </>
                }
            </h3>
            
        </Container>
    );
}

export default List