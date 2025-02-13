import './Env_Data.css';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Delete, ExpandMore, SearchSharp } from '@mui/icons-material';
import Error from '../Functional_Layout/Error404';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { plants } from '../Functional_Layout/plantsData.js'; // Adjust the path accordingly
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Functional_Layout/loader';
import axios from 'axios';

function Env_Data() {
  const nav = useNavigate();
  const [plant, setPlants] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState({});
  const [sensorData, setSensorData] = useState(null);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  // Use useEffect to retrieve data when the component mounts
  useEffect(() => {
    if (plants) {
      setPlants([...plants]);
    } else {
      console.log("No plants found");
    }
  }, []);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decode = jwtDecode(token);
        setToken(decode);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Fetch sensor data
  useEffect(() => {
    if (isAuthenticated) {
      const fetchSensorData = async () => {
        try {
          const response = await fetch(`https://env-monitor-server.onrender.com/sensors/670fb29c24640eb71ba9f641`);
          const data = await response.json();
          setSensorData(data.sensors);
          filterPlants(data.sensors);
        } catch (error) {
          console.error('Error fetching sensor data:', error);
        }
      };

      fetchSensorData();
    }
  }, [isAuthenticated]);

  // Parse range values Filtering plants
  const parseRange = (range) => {
    if (!range) return { min: 0, max: Infinity };
    const cleanedRange = range.replace(/[^\d.\s-]/g, "");
    let parts = cleanedRange.trim().split(" ");
    let min = parseInt(parts[0], 10);
    let max = parseInt(parts[2], 10);
    return { min: isNaN(min) ? 0 : min, max: isNaN(max) ? Infinity : max };
  };

  // Calculate difference and assign class
  const calculateDifferenceClassOverall = (soilPh, soilMoisture, airTemperature, plantPh, plantMoisture, plantAir) => {
    const { min: phmin, max: phmax } = parseRange(plantPh);
    const { min: moistmin, max: moistmax } = parseRange(plantMoisture);
    const { min: Airmin, max: Airmax } = parseRange(plantAir);

    const differencePh = Math.round(soilPh - ((phmin + phmax) / 2));
    const differenceMoisture = Math.round(soilMoisture - ((moistmin + moistmax) / 2));
    const differenceAir = Math.round(airTemperature - ((Airmin + Airmax) / 2));

    if (differencePh === 0 && differenceMoisture === 0 && differenceAir === 0) return 'very-good-growth';
    if (differencePh <= 2 && differenceMoisture <= 2 && differenceAir <= 2) return 'good-growth';
    if (differencePh <= 4 && differenceMoisture <= 4 && differenceAir <= 4) return 'moderate-growth';
    if (differencePh <= 5 && differenceMoisture <= 5 && differenceAir <= 5) return 'hard-to-survive';
    return 'not-suitable';
  };

  // Filter plants based on sensor data
  const filterPlants = (sensors) => {
    setLoading(true);
    if (!plant || plant.length === 0) {
      console.warn("No plant data available for filtering.");
      setFilteredPlants([]);
      setLoading(false);
      return;
    }
    const matchedPlants = plant.filter(plant => {
      const airTempValue = parseInt(sensors?.airTemperature?.value ?? 0);
      const soilMoistureValue = parseInt(sensors?.soilMoisture?.value ?? 0);
      const soilPhValue = parseInt(sensors?.soilPh?.value ?? 0);
      const airTemp = parseRange(plant["Air temperture"]);
      const soilMoisture = parseRange(plant["Soil Moisture"]);
      const soilPh = parseRange(plant["Soil Ph Level"]);

      return (
        airTempValue >= airTemp.min && airTempValue <= airTemp.max &&
        soilMoistureValue >= soilMoisture.min && soilMoistureValue <= soilMoisture.max &&
        soilPhValue >= soilPh.min && soilPhValue <= soilPh.max
      );
    });
    setFilteredPlants(matchedPlants);
    setLoading(false);
  };

  // Send SMS
  const handleSendSms = async () => {
    if (token.phone && message && sensorData) {
      setLoading(true);
      const template =
        `
      Sensor Data:
      Air temperture: ${sensorData?.airTemperature.value} ${sensorData?.airTemperature.unit}
      Soil Moisture: ${sensorData?.soilMoisture.value} ${sensorData?.soilMoisture.unit}
      Soil Ph Level: ${sensorData?.soilPh.value} ${sensorData?.soilPh.unit}
      `;
      try {
        const response = await axios.post('https://env-monitor.vercel.app/send-sms', { to: token.phone + "".split(" ").join(""), message: message + "" + template });
        if (response.status === 200) {
          toast.success('SMS sent successfully!', { autoClose: 2000 });
          window.location.reload();
        } else {
          toast.error('Failed to send SMS.', { autoClose: 2000 });
        }
      }
      catch (error) {
        console.error('Error sending SMS:', error);
        toast.error('An error occurred while sending SMS.', { autoClose: 2000 });
      }
      finally {
        setLoading(false);
      }
    }
  };

  const handlePlantClick = (plant) => {
    const plantDetails = `
      Plant Name: ${plant["Plant Name"]}
      Air Temperature: ${plant["Air temperture"]}
      Soil Moisture: ${plant["Soil Moisture"]}
      Soil Ph Level: ${plant["Soil Ph Level"]}
      N.P.K: ${plant["N.P.K"]}
      Season: ${plant["Season"]}
      Growth Period: ${plant["Growth Period"]}
      Land Space: ${plant["Land Space"]}
      Investment: ${plant["Inversment"]}
      Profit: ${plant["Profit"]}
      Soil type: ${plant["Soil type"]}
    `;
    setMessage(plantDetails);
  };

  if (!sensorData) {
    return (
      <div><Loader /></div>
    );
  }

  if (loading) {
    return (
      <>
        <div><Loader /></div>
      </>
    );
  }

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <button onClick={() => { nav('/') }} className='back-btn'>
            <span className='back-arrow'><ArrowBack /></span>Back
          </button>
          <div className='data-container'>
            {sensorData && (
              <div className='sensor-info'>
                <h2>Sensor Data</h2>
                <p>Air Temperature: {sensorData?.airTemperature.value} {sensorData?.airTemperature.unit}</p>
                <p>Soil Moisture: {sensorData?.soilMoisture.value} {sensorData?.soilMoisture.unit}</p>
                <p>Soil pH: {sensorData?.soilPh.value} {sensorData?.soilPh.unit}</p>
              </div>
            )}
            {filteredPlants.length > 0 ? (
              <div className='plant-info'>
                <h2>Suitable Plants</h2>
                <ul>
                  {filteredPlants.map((plant, index) => (
                    <li key={index} onClick={() => handlePlantClick(plant)}>
                      {plant["Plant Name"]}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No suitable plants found for the current conditions.</p>
            )}
            <div className='sms-container'>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message to send via SMS"
                rows={4}
                cols={50}
              />
              <div className='space-between'>
              <button onClick={() => handleSendSms()} className='send-sms-btn'>Send SMS</button>
              <button className='search-icon' onClick={()=>{setMessage("")}}><Delete/></button>
              </div>
            </div>
          </div>
          {/* ------------------------All Plants------------------------ */}
          <div className='Plant-container'>
            <h2>All Plants</h2>
            <div className='badge-container'>
              <div className='very-good'>very-good</div>
              <div className='good'>good</div>
              <div className='moderate'>moderate</div>
              <div className='hard'>hard</div>
              <div className='not'>not-suitable</div>
            </div>
            <div className='search-container'>
              <div className='search-icon'>
                <SearchSharp />
              </div>
              <div className='search-text'>
                <textarea
                  type="text"
                  placeholder={"Search"}
                  className='search-box'
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filtered = plants.filter((plant) =>
                      plant["Plant Name"].toLowerCase().includes(searchTerm)
                    );
                    setPlants(filtered);
                  }}
                />
              </div>
            </div>
            <div className='all-plants-container'>
              <div className="accordion">
                {plant?.map((plant, index) => {
                  const plantClass = calculateDifferenceClassOverall(sensorData?.soilPh?.value, sensorData?.soilMoisture?.value, sensorData?.airTemperature?.value, plant["Soil Ph Level"], plant["Soil Moisture"], plant["Air temperture"]);

                    return (
                    <div key={index} className={`border ${plantClass} accordion-item ${activeIndex === index ? "active" : ""}`}>
                      <button className="accordion-header" onClick={() => toggleAccordion(index)}>
                      <div className='title'>{plant["Plant Name"]}</div><div className='expand-title'><ExpandMore/></div>
                      </button>
                      <div className="accordion-content" style={{ maxHeight: activeIndex === index ? "200px" : "0" }}>
                      <table>
                        <tbody>
                        <tr>
                          <td>Air Temperature:</td>
                          <td>{plant["Air temperture"]}</td>
                        </tr>
                        <tr>
                          <td>Soil Moisture:</td>
                          <td>{plant["Soil Moisture"]}</td>
                        </tr>
                        <tr>
                          <td>Soil Ph Level:</td>
                          <td>{plant["Soil Ph Level"]}</td>
                        </tr>
                        <tr>
                          <td>N.P.K:</td>
                          <td>{plant["N.P.K"]}</td>
                        </tr>
                        <tr>
                          <td>Season:</td>
                          <td>{plant["Season"]}</td>
                        </tr>
                        <tr>
                          <td>Growth Period:</td>
                          <td>{plant["Growth Period"]}</td>
                        </tr>
                        <tr>
                          <td>Land Space:</td>
                          <td>{plant["Land Space"]}</td>
                        </tr>
                        <tr>
                          <td>Investment:</td>
                          <td>{plant["Inversment"]}</td>
                        </tr>
                        <tr>
                          <td>Profit:</td>
                          <td>{plant["Profit"]}</td>
                        </tr>
                        <tr>
                          <td>Soil type:</td>
                          <td>{plant["Soil type"]}</td>
                        </tr>
                        </tbody>
                      </table>
                      </div>
                    </div>
                    );
                })}
              </div>
            </div>
          </div>
        </>
      ) : (
        <Error />
      )}
    </>
  );
}

export default Env_Data;
