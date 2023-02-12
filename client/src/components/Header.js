import {useState} from 'react';
import {Link} from 'react-router-dom';

import styles from "./Header.module.css";
import Icon from "../assets/Icon.png";

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';

import {useDispatch, useSelector} from 'react-redux';
import {setLogout} from "../store/ProfileSlice";

const Header = () => {

  const username=useSelector((state) => state.profile.username);

  const [show, setShow] = useState(false);

  const handleShow = () =>{
    if(window.innerWidth<=767){
      setShow(!show);
    }
  }

  const dispatch=useDispatch();

  const logoutHandler=()=>{
    dispatch(setLogout());
  }

  return (
    <Navbar key="sm" bg="light" variant="light" expand="md" sticky="top" >
      <Container fluid style={{padding:"5px 20px"}}>
        <Link to="/inbox" className={styles.header}>
          <div style={{display:"flex",justifyContent:"center"}}>
            <img src={Icon} alt="Icon" />
            <b style={{color:"red",marginLeft:"3px"}}>AIL-IT</b>
          </div>
        </Link>
        <Navbar.Toggle aria-controls="offcanvasNavbar-expand-sm" onClick={handleShow}/>
        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-sm"
          aria-labelledby="offcanvasNavbarLabel-expand-sm"
          placement="start"

          show={show}
          onHide={handleShow}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbar-expand-sm">
            <Link to="/inbox" className={styles.header} onClick={handleShow}>
              <div style={{display:"flex",justifyContent:"center"}}>
                <img src={Icon} alt="Icon" />
                <b style={{color:"red",marginLeft:"3px"}}>AIL-IT</b>
              </div>
            </Link>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-center flex-grow-1 pe-3">
              <Nav.Link onClick={handleShow}>
                <Link to="/compose" style={{color:"white", backgroundColor:"red", padding:"7px", borderRadius:"5px"}} className={styles.link}>COMPOSE</Link>
              </Nav.Link>
              <Nav.Link />
              <Nav.Link onClick={handleShow}>
                <Link to="/inbox" className={styles.link}>INBOX</Link>
              </Nav.Link>
              <Nav.Link />
              <Nav.Link onClick={handleShow}>
                <Link to="/sent" className={styles.link}>SENT</Link>
              </Nav.Link>
              <Nav.Link />
              <Nav.Link onClick={handleShow}>
                <Link to="/important" className={styles.link}>IMPORTANT</Link>
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link />
                <Navbar.Text  onClick={handleShow} style={{maxWidth:"90vh", maxHeight:"5vh", overflow:"hidden", fontWeight:"bold"}}><Link to="/profile" style={{color:"blue"}}>{username}</Link></Navbar.Text>
              <Nav.Link />
              <Nav.Link>
                <Navbar.Text className={styles.link} style={{color:"red"}} onClick={logoutHandler}>LOGOUT</Navbar.Text>
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}

export default Header