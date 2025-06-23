function SunTable({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="sun-table-wrapper">
      <table className="sun-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Golden Hour Inicio</th>
            <th>Sunrise</th>
            <th>Sunset</th>
            <th>Golden Hour Fim</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.date}>
              <td>{item.date}</td>
              <td>{item.golden_hour_start}</td>
              <td>{item.sunrise}</td>
              <td>{item.sunset}</td>
              <td>{item.golden_hour_end}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SunTable;
