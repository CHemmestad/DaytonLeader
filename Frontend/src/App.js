import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import reportWebVitals from './reportWebVitals.js';
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
import AdBar from "./AdBar.js";
import Paper from "./Paper.js";
import Subscribe from "./Subscribe.js";
import Contact from "./Contact.js";
import { CheckoutForm, Return } from './Checkout'; 
import Action from "./Action.js";
import Comedy from "./Comedy.js";
import Thriller from "./Thriller.js";
import Animated from "./Animated.js";
// import { useState } from 'react';

function App() {
  const [contacts, setContacts] = useState([]);
  // const [userRole, setUserRole] = useState("user");
  // const [userRole, setUserRole] = useState("admin");
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="App">
      {/* {userRole ? ( */}
      {/* // <Router basename="/DaytonLeader"> */}
      <Router>
        <div className="d-flex">
          <SideBar userRole={userRole} setUserRole={setUserRole} />
          <div className="flex-grow-1 d-flex flex-column">
            <div className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/paper" element={<Paper userRole={userRole} />} />
                <Route path="/subscribe" element={<Subscribe />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                {userRole === "admin" && (
                  <>
                    <Route path="/add-contact" element={<AddContact contacts={contacts} setContacts={setContacts} />} />
                    <Route path="/deletecontact" element={<DeleteContact contacts={contacts} setContacts={setContacts} />} />
                    {/* <Route path="/updatecontact" element={<UpdateContact contacts={contacts} setContacts={setContacts} />} /> */}
                  </>
                )}
                <Route path="/checkout" element={<CheckoutForm />} />
                <Route path="/return" element={<Return />} />
              </Routes>
            </div>
            <footer className="p-2 text-center">
              <p style={{ margin: '0px' }}>Copyright © {new Date().getFullYear()} The Dayton Leader - All Rights Reserved.</p>
            </footer>
          </div>
          {(userRole !== "user" && userRole !== "admin") && <AdBar />}
        </div>
      </Router>
      {/* ) : (
        <Authentication
          username={username} setUsername={setUsername}
          password={password} setPassword={setPassword}
          setUserRole={setUserRole} />
      )} */}
    </div>
  );
}

export default App;
