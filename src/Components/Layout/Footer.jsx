import React from "react";
import './Footer.css';
export default function Footer() {
  return (
    <div className="footer">
      <h1>ECO-BOT</h1> 
      <hr/>
      <div className="container">
      <div className="cards">
        <strong style={{color:"black"}}>Objective</strong>
        <div>
          <p style={{width:"250px"}}>Existing agricultural methods do not provide real-time and precise
            environmental information, impeding effective decision-making for
            watering, fertilizing, and soil management.
            </p>
        </div>
      </div>
      <div className="cards">
         <strong style={{color:"black"}}>Pages</strong>
         <ul>
          <li>Home</li>
          <li>Dashboard</li>
          <li>Alerts & Notifications</li>
          <li>Logout</li>
         </ul>
      </div>
      <div className="cards">
         <strong style={{color:"black"}}>Features</strong>
         <ul>
          <li>Key features and functionalities available.</li>
          <li>Overview of main services offered.</li>
          <li>Highlight of tools and unique features.</li>
         </ul>
      </div>
      <div className="cards">
          <strong style={{color:"black"}}>Contacts</strong>
          <ul>
            <li>Phone: 91+ 93426 29075</li>
            <li>Email: <a href="mailto:jebershon100@gmail.com" style={{color:"white",fontStyle:"unset"}}>jebershon100@gmail.com</a></li>
            <li>Address: 123 Main St, Anytown, USA</li>
          </ul>
      </div>
      </div>
      <hr/>
      <div className="copyrights">
          <strong style={{color:"black"}}>copy rights by &copy; Itech 2025</strong>
      </div>
    </div>
  );
}
