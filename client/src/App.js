
import Header from "./components/Header";
import Login from "./components/forms/Login";
import Register from "./components/forms/Register";
import Compose from "./components/Compose";
import Profile from "./components/Profile";
import List from "./components/List";
import Default from "./components/Default";
import SinglePage from "./components/SinglePage";

import {Routes, Route, Navigate} from "react-router-dom";
import {useSelector} from 'react-redux';

function App() {

  const loggedIn=useSelector((state) => state.profile.loggedIn);

  return (
    <>
    {loggedIn && <Header />}
    <Routes>
      <Route path="/" element={ !loggedIn?<Default />:<Navigate replace to="/inbox" />    } />
      <Route path="/login" element={ !loggedIn?<Login />:<Navigate replace to="/inbox" />    } />
      <Route path="/register" element={ !loggedIn?<Register />:<Navigate replace to="/inbox" />    } />

      <Route path="/compose" element={ loggedIn?<Compose />:<Navigate replace to="/login" />    } />

      <Route path="/inbox" element={ loggedIn?<List type="inbox" />:<Navigate replace to="/login" />    } />
      <Route path="/inbox/:objectId" element={ loggedIn?<SinglePage type="inbox" />:<Navigate replace to="/login" />    } />

      <Route path="/sent" element={ loggedIn?<List type="sent" />:<Navigate replace to="/login" />    } />
      <Route path="/sent/:objectId" element={ loggedIn?<SinglePage type="sent" />:<Navigate replace to="/login" />    } />

      <Route path="/important" element={ loggedIn?<List type="important" />:<Navigate replace to="/login" />    } />
      <Route path="/important/:objectId" element={ loggedIn?<SinglePage type="important" />:<Navigate replace to="/login" />    } />
      
      <Route path="/profile" element={ loggedIn?<Profile />:<Navigate replace to="/login" />    } />

      <Route path="*" element={ <Navigate replace to={!loggedIn?"/":"/inbox"} />} />
    </Routes>
    </>
  );
}

export default App;
