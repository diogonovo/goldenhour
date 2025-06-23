import React, { useState } from 'react';
import './App.css';
import SunTimeline from './components/SunTimeline';
import SunChart from './components/SunChart';
import SunTable from './components/SunTable';


function App() {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [confirmedLocation, setConfirmedLocation] = useState('');
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offsetMinutes = new Date().getTimezoneOffset(); // em minutos
  const offsetHours = -offsetMinutes / 60; // inverter o sinal, porque getTimezoneOffset dá negativo para UTC+
  const offsetString = `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`;



  const fetchData = async () => {
    setError(null);
    try {

      if (!location || !startDate || !endDate) {
      setError("Por favor preenche todos os campos obrigatórios.");
      return;
      }

      if (new Date(endDate) <= new Date(startDate)) {
      setError('A data de fim deve ser posterior à data de início.');
      return;
  }

      const response = await fetch(
        `http://localhost:9292/sun_data?location=${encodeURIComponent(location)}&start_date=${startDate}&end_date=${endDate}`
      );
      const result = await response.json();

      if (result.error) {
        setError(result.error);
        setData([]);
      } else {
        setData(result.data || []);
        setConfirmedLocation(location);
      }
    } catch (err) {
      setError('Erro, tente mais tarde.');
      setData([]);
    }
  };

  return (
    <div className="container">
      <h1 className="title">GoldenHours</h1>
      <p className="subtitle">Para a foto perfeita 📷</p>
      <p className="timezone-note">
      *Os horários apresentados estão em UTC. O seu fuso horário é {timezone} ({offsetString}).
      </p>



    <div className="controls">
      <div className="input-group">
        <label>Localização</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="ex: Lisboa"
        />
      </div>
      <div className="input-group">
        <label>Data Início</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Data Fim</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button className="primary-button" onClick={fetchData}>Consultar</button>
    </div>


      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data.length > 0 && (
        <>
          <h2 style={{ marginTop: '2rem', textTransform: 'capitalize' }}>
            {confirmedLocation}, Golden Hours
          </h2>

          {data.map((day, idx) => (
            <SunTimeline
              key={idx}
              sunrise={day.sunrise}
              sunset={day.sunset}
              twilightStart={day.golden_hour_start}
              twilightEnd={day.golden_hour_end}
              date={day.date}
            />
          ))}

          
        </>
      )}

      {data.length > 0 && (
      <>
        <SunChart data={data} />
        <SunTable data={data} />
      </>
      )}

      <footer className="footer">Desenvolvido por Diogo Novo</footer>
    </div>
  );
}

export default App;
