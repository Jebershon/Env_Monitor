import React from "react";
import "./Home.css";
import logo from "../../Assests/ecobot.png";
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BarChartIcon from '@mui/icons-material/BarChart';
import Footer from "./Footer";
import { Settings } from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router-dom";
const Home = () => {
const nav = useNavigate();
  return (
    <div className="home-container"  id="home">
      <div className="position">
      <div className="nav">
      <div className="contain">
        <div className="Home"><a href="#home"><button className="nav-btn"><HomeIcon/></button></a></div>
        <div className="Account"><button className="nav-btn" onClick={()=>{nav('/Signup')}}><AccountBoxIcon/></button></div>
        <div className="Data"><button className="nav-btn" onClick={()=>{nav('/Env_View')}}><BarChartIcon/></button></div>
        <div className="settings"><button className="nav-btn" onClick={()=>{nav('/Settings')}}><Settings/></button></div>
      </div>
      </div>
      </div>
      <div className="hero-section">
        <img src={logo} alt="Project" className="hero-image" />
        <h1 className="project-title">
          Automated Environmental Surveillance and Monitoring System
        </h1>
      </div>

      <div className="card-container">
        <div className="card">
          <h2 className="card-title">Introduction</h2>
          <p className="card-content">
            Existing agricultural methods do not provide real-time and precise
            environmental information, impeding effective decision-making for
            watering, fertilizing, and soil management.
          </p>
          <p className="card-content">
            Our solution introduces a robotic system that independently moves
            through fields, gathers data, and sends it to a centralized
            application. The application utilizes advanced algorithms to analyze
            the data and offer valuable insights to farmers, ultimately boosting
            efficiency and sustainability.
          </p>
        </div>

        <div className="card">
          <h2 className="card-title">Objective</h2>
          <p className="card-content">
            To design and develop an autonomous robot equipped with an
            environment monitoring system. The robot will utilize various
            sensors to collect data on soil moisture, air temperature, pH value,
            and NPK (nitrogen, phosphorus, potassium) levels. This data will be
            transmitted to a dedicated application for processing and analysis.
          </p>
          <p className="card-content">
            The goal is to provide accurate and actionable information to aid in
            effective environmental management and agricultural practices.
          </p>
        </div>

        <div className="card">
          <h2 className="card-title">Problem Statement</h2>
          <ul className="card-content problem-list">
            <p className="problem-item">
              Employing personnel for extensive monitoring can be expensive and
              may not be sustainable for small-scale farmers or organizations
              with limited resources.
            </p>
            <p className="problem-item">
              The time required to collect, record, and analyze data manually
              can delay responses to adverse conditions, potentially leading to
              damage before corrective actions are taken.
            </p>
            <p className="problem-item">
              Data collected manually is often less granular, making it
              difficult to identify specific areas that need attention.
            </p>
            <p className="problem-item">
              Skilled personnel may not always be available, particularly in
              remote or rural areas.
            </p>
          </ul>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
