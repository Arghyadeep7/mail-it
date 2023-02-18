import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import styles from "./SinglePage.module.css";

const SinglePage = (props) => {

  const param = useParams().objectId;

  const navigate = useNavigate();

  const [star, setStar] = useState(false);

  const [data, setData] = useState(null);

  const [stat, setStat]=useState(null);

  const username = useSelector((state) => state.profile.username);

  const request = async () => {
    const response = await fetch("/api/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    }).then((res) => res.json());

    let flag = false;

    for (let i = 0; i < response.mails.length; i++) {
      if (response.mails[i]._id === param) {
        flag = true;
        setData(response.mails[i]);
        setStar(response.mails[i].starred);
        setStat(response.mails[i].stat);
        break;
      }
    }

    if (flag === false) {
      navigate("/inbox");
    }
  };

  const handler = async (url) => {
    const obj = {
      ids: [data._id],
      username: username,
    };

    if (url === "/api/star") {
      obj.starred = !star;
    }else if(url==="/api/opened"){
      obj.stat="OPENED";
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    }).then((res) => res.json());

    if (response.message === "SUCCESSFUL") {
      if (url==="/api/star") {
        setStar(!star);
      } else if(url!=="/api/opened"){
        navigate(props.type);
      }
    } else {
      alert("Some error has occurred.\nPlease try again later.");
    }
  };

  useEffect(() => {
    request();
  }, []);

  if(stat && stat==="NEW" ){
    setStat("OPENED");
    handler("/api/opened");
  }

  return (
    <Container fluid>
      {data && (
        <>
          <div style={{ margin: "10px" }}>
            <Link
              to={"/"+props.type}
              className={styles.btn}
              style={{ color: "rgb(108, 103, 103)" }}
            >
              <i className="fa-solid fa-arrow-left fa-lg"> B A C K</i>
            </Link>
          </div>
          <div className={styles.container}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>

              <div>
                <span className={styles.field}>Date &nbsp;&nbsp;</span>
                {data.dateObj.date} / {data.dateObj.month} / {data.dateObj.year}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {window.innerWidth<512 && <br />}
                <span className={styles.field}>Time &nbsp;&nbsp;</span>
                {data.dateObj.hour} : {data.dateObj.minute}
              </div>

              <div style={{display:"flex", justifyContent: "center"}}>

                <Link
                  className={styles.btn}
                  style={{ color: "gold" }}
                  onClick={() => handler("/api/star")}
                >
                  <i
                    className={`fa-${star ? "solid" : "regular"} fa-star fa-2x`}
                  ></i>
                </Link>

                <Link
                  className={styles.btn}
                  style={{ color: "red", marginLeft: "25px" }}
                  onClick={() => handler("/api/delete")}
                >
                  <i className="fa-solid fa-trash-can fa-2x"></i>
                </Link>

              </div>

            </div>
            <Row style={{ textAlign: "left", marginTop: "3vh" }}>
              
              <hr style={{ border: "1px solid black" }} />


              <Col md={6} style={{margin:"1.25vh 0"}} className={styles.info}>
                <Row>
                  <Col xs={4} lg={3} xl={2}>
                    <span className={styles.field}>Sender</span>
                  </Col>
                  <Col xs={8} lg={9} xl={10}>
                    {data.sender}
                  </Col>
                  <Col xs={4} lg={3} xl={2}>
                    <span className={styles.field}>Username</span>
                  </Col>
                  <Col xs={8} lg={9} xl={10}>
                    {data.senderAdd}
                  </Col>
                </Row>
              </Col>


              <Col md={6} style={{margin:"1.25vh 0"}} className={styles.info}>
                <Row>
                  <Col xs={4} lg={3} xl={2}>
                    <span className={styles.field}>Receiver</span>
                  </Col>
                  <Col xs={8} lg={9} xl={10}>
                    {data.receiver}
                  </Col>
                  <Col xs={4} lg={3} xl={2}>
                    <span className={styles.field}>Username</span>
                  </Col>
                  <Col xs={8} lg={9} xl={10}>
                    {data.receiverAdd}
                  </Col>
                </Row>
              </Col>

              <hr style={{ border: "1px solid black", marginTop: "7px" }} />


              <Col xs={12} className={styles.info}>
                <Row>
                  <Col xs={3} md={2} lg={1}>
                    <span className={styles.field}>Subject</span>
                  </Col>
                  <Col xs={9} md={10} lg={11}>
                    {data.sub?data.sub:<i>(No subject)</i>}
                  </Col>
                </Row>
              </Col>
              <Col xs={12} className={styles.info}>
                <Row>
                  <Col xs={3} md={2} lg={1} style={{marginBottom:"10px"}}>
                    <span className={styles.field}>Body</span>
                  </Col>
                  <Col xs={9} md={10} lg={11} style={{whiteSpace: "pre-wrap"}}>
                      {data.msg?data.msg:<i>(No body)</i>}
                  </Col>
                </Row>
              </Col>

            </Row>
          </div>
        </>
      )}
    </Container>
  );
};

export default SinglePage;
