import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PreAuctionPage.css';

function PreAuctionPage() {
    const apiUrl = process.env.API_BASE_URL;

    const [auctionReadyTime, setAuctionReadyTime] = useState(new Date());
    const [auctionStartTime, setAuctionStartTime] = useState(new Date());
    const [trayInfo, setTrayInfo] = useState({
      fishName: '',
      kilogram: 0,
      basePrice: 0,
      fishermanName: '',
    });
    const [trays, setTrays] = useState([]);
    const [showTrayForm, setShowTrayForm] = useState(false);
  
    useEffect(() => {
      const fetchTrays = async () => {
        try {
          const response = await fetch(`${apiUrl}//tray`);
          if (response.ok) {
            const data = await response.json();
            setTrays(data);
          } else {
            console.error('Failed to fetch trays:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching trays:', error);
        }
      };
  
      fetchTrays();
    }, []);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setTrayInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    };

  const handleCreateAuction = async () => {
    const auctionData = {
      readyTime: auctionReadyTime.toISOString(),
      startTime: auctionStartTime.toISOString()
    };

    try {
      const response = await fetch(`${apiUrl}/auction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(auctionData),
      });
      if (response.ok) {
        alert('Auction created successfully!');
      } else {
        alert('Failed to create auction');
      }
    } catch (error) {
      console.error('Error creating auction:', error);
      alert('Error creating auction');
    }
  };

  const handleStartAuction = async () => {
    try {
      const response = await fetch(`${apiUrl}/auction/start`, {
        method: 'POST',
      });
      if (response.ok) {
        alert('Auction started successfully!');
      } else {
        alert('Failed to start auction');
      }
    } catch (error) {
      console.error('Error starting auction:', error);
      alert('Error starting auction');
    }
  };

  const handleAddTray = async () => {
    const trayEntryTime = new Date().toISOString();
    const newTray = { ...trayInfo, trayEntryTime };

    console.log(newTray)

    const response = await fetch(`${apiUrl}/tray`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTray),
    });

    if (response.ok) {
        setTrayInfo({
            fishName: '',
            kilogram: 0,
            basePrice: 0,
            fishermanName: ''
        }); 
        setShowTrayForm(false); 
        alert('Tray added successfully!');
    } else {
        alert('Failed to add tray');
    }
  };

  return (
    <div className="pre-auction-page">
      <div className="create-auction">
        <h2>Create Auction</h2>
        <div className="form-group">
          <label>Auction Ready Time</label>
          <DatePicker
            selected={auctionReadyTime}
            onChange={(date) => setAuctionReadyTime(date)}
            showTimeSelect
            dateFormat="Pp"
          />
        </div>
        <div className="form-group">
          <label>Auction Start Time</label>
          <DatePicker
            selected={auctionStartTime}
            onChange={(date) => setAuctionStartTime(date)}
            showTimeSelect
            dateFormat="Pp"
          />
        </div>
        <button className="btn btn-primary" onClick={handleCreateAuction}>Create Auction</button>
        <button className="btn btn-primary" onClick={handleStartAuction}>Start Auction</button>
      </div>

      <div className="tray-section">
        <h2>Trays</h2>
        <ul className="tray-list">
          {trays.map((tray, index) => (
          <li key={index}>
              <p>Entry Time: {new Date(tray.tray_entry_time).toLocaleString()}</p>
              <p>Fish Type: {tray.fish_type}</p>
              <p>Weight: {tray.weight} kg</p>
              <p>Base Price: ${tray.base_price}</p>
              <p>Fisherman Name: {tray.fisherman_name}</p>
            </li>
          ))}
        </ul>
        <button className="btn btn-secondary" onClick={() => setShowTrayForm(true)}>Add Tray</button>
      </div>

      {showTrayForm && (
        <div className="add-tray-form">
          <h2>Add Tray</h2>
          <div className="form-group">
            <label>Fish Type</label>
            <input
              type="text"
              name="fishName"
              value={trayInfo.fishName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Weight</label>
            <input
              type="number"
              name="kilogram"
              value={trayInfo.kilogram}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Base Price</label>
            <input
              type="number"
              name="basePrice"
              value={trayInfo.basePrice}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Fisherman Name</label>
            <input
              type="text"
              name="fishermanName"
              value={trayInfo.fishermanName}
              onChange={handleInputChange}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddTray}>Submit Tray</button>
          <button className="btn btn-secondary" onClick={() => setShowTrayForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default PreAuctionPage;
