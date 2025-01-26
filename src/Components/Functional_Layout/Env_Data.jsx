import './Env_Data.css';
import { useNavigate } from 'react-router-dom';
import { ArrowBack,SearchSharp } from '@mui/icons-material';
import Error from '../Functional_Layout/Error404';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { plants } from '../Functional_Layout/plantsData.js'; // Adjust the path accordingly
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Env_Data() {
  const nav = useNavigate();
  const [plant, setPlants] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [message, setMessage] = useState('');
  const [to ,setTo] = useState("");

// Use useEffect to retrieve data when the component mounts
  useEffect(() => {
    if (plants) {
      setPlants([...plants]); 
    }
    else{
      console.log("No plants found");
    }
  }, []);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decode = jwtDecode(token);
        setTo(decode.phone+"".split(" ").join(""));
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
          const response = await fetch('https://env-monitor-server.onrender.com/sensors/670fb29c24640eb71ba9f641');
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
        const [min, max] = range
            .replace(/[^\d.\s-]/g, "") // Remove °C, %, etc.
            .split("to")
            .map((val) => parseFloat(val.trim()));
        return { min: min || 0, max: max || Infinity };
    };

  // Filter plants based on sensor data
  const filterPlants = (sensors) => {
    if (!plant || plant.length === 0) {
      console.warn("No plant data available for filtering.");
      setFilteredPlants([]);
      return;
    }

    const matchedPlants = plant.filter(plant => {
        const airTempValue = sensors?.airTemperature?.value ?? 0;
        const soilMoistureValue = sensors?.soilMoisture?.value ?? 0;
        const soilPhValue = sensors?.soilPh?.value ?? 0;

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
  };

  const handleSendSms = async () => {
    try {
      const response = await axios.post('https://env-monitor-server.onrender.com/send-sms', {to , message});
      if (response.status === 200) {
        toast.success('SMS sent successfully!', { autoClose: 2000 });
      } else {
        toast.error('Failed to send SMS.', { autoClose: 2000 });
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast.error('An error occurred while sending SMS.', { autoClose: 2000 });
    }
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
                <p>Air Temperature: {sensorData.airTemperature.value} {sensorData.airTemperature.unit}</p>
                <p>Soil Moisture: {sensorData.soilMoisture.value} {sensorData.soilMoisture.unit}</p>
                <p>Soil pH: {sensorData.soilPh.value} {sensorData.soilPh.unit}</p>
              </div>
            )}
            {filteredPlants.length > 0 ? (
              <div className='plant-info'>
                <h2>Suitable Plants</h2>
                <ul>
                  {filteredPlants.map((plant, index) => (
                    <li key={index}>{plant["Plant Name"]}</li>
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
              <button onClick={handleSendSms} className='send-sms-btn'>Send SMS</button>
            </div>
          </div>
          {/* ------------------------All Plants------------------------ */}
          <div className='Plant-container'>
          <h2>All Plants</h2>
            <div className='search-container'>
            <div className='search-icon'>
            <SearchSharp/>
            </div>
            <div className='search-text'>
            <input
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
              <div>
                {plant?.map((plant, index) => (
                  <div key={index} className='Plant-container'>
                    {plant["Plant Name"]}
                    <button onClick={() => {console.log("Comparing...")}} className='compare-btn'>Compare Readings</button>
                  </div>
                ))}
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
