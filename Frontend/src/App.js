import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import logo from './logo.svg';
import './App.css';
import reportWebVitals from './reportWebVitals.js';
import background from "./Images/Background.webp"
import SideBar from "./SideBar.js";
import Contacts from "./Contacts.js";
import AddContact from "./AddContacts.js";
import DeleteContact from "./DeleteContacts.js";
import SearchContact from "./SearchContacts.js";
import Authentication from "./Login";
import NewMessage from "./NewMessages.js";
import Home from "./Home.js";
import FAQs from "./FAQ.js"; 
import About from "./About.js";
import Action from "./Action.js";
import Comedy from "./Comedy.js";
import Thriller from "./Thriller.js";
import Animated from "./Animated.js";
// import { useState } from 'react';

function App() {
  const [contacts, setContacts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="App">
      {userRole ? (
        <Router>
          <div className="d-flex">
            {userRole && <SideBar userRole={userRole} username={username} password={password} />}
            <body>
            <div className="flex-grow-1 p-3" 
                        style={{
                          width: '88vw',
                          minHeight: '100vh',
                          backgroundImage: `url(${background})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundAttachment: 'fixed',
                          backgroundColor: 'darkRed',
                    }}>
              <h1 className="text-center">Movie Reviews App</h1>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contacts" element={<Contacts contacts={contacts} setContacts={setContacts} />} />
                <Route path="/contacts/action" element={<Action contacts={contacts} setContacts={setContacts} />} />
                <Route path="/contacts/animated" element={<Animated contacts={contacts} setContacts={setContacts} />} />
                <Route path="/contacts/comedy" element={<Comedy contacts={contacts} setContacts={setContacts} />} />
                <Route path="/contacts/thriller" element={<Thriller contacts={contacts} setContacts={setContacts} />} />
                <Route path="/searchContacts" element={<SearchContact contacts={contacts} setContacts={setContacts} />} />
                <Route path="/new_message" element={<NewMessage contacts={contacts} setContacts={setContacts} />} />
                <Route path="/FAQs" element={<FAQs />} />
                <Route path="/About" element={<About/>}/>
                {userRole === "admin" && (
                  <>
                    <Route path="/add-contact" element={<AddContact contacts={contacts} setContacts={setContacts} />} />
                    <Route path="/deletecontact" element={<DeleteContact contacts={contacts} setContacts={setContacts} />} />
                    {/* <Route path="/updatecontact" element={<UpdateContact contacts={contacts} setContacts={setContacts} />} /> */}
                  </>
                )}
              </Routes>
            </div>
            </body>
          </div>
        </Router>
      ) : (
        <Authentication
          username={username} setUsername={setUsername}
          password={password} setPassword={setPassword}
          setUserRole={setUserRole} />
      )}
    </div>
  );
}

export default App;
