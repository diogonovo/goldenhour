import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

function toMinutes(timeStr) {
  if (!timeStr || !/^\d{2}:\d{2}$/.test(timeStr)) return null;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function formatHour(mins) {
  if (mins == null || isNaN(mins)) return '--:--';
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

function SunChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = data.map((item) => ({
    date: item.date,
    sunrise: toMinutes(item.sunrise),
    goldenHourStart: toMinutes(item.golden_hour_start),
    goldenHourEnd: toMinutes(item.golden_hour_end),
    sunset: toMinutes(item.sunset),
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <XAxis dataKey="date" />
          <YAxis
            domain={[0, 1440]}
            tickFormatter={formatHour}
            label={{ value: 'Hora do dia', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(v) => formatHour(v)}
            labelFormatter={(label) => `Data: ${label}`}
          />
          <Legend verticalAlign="top" height={36} />

          <Line type="monotone" dataKey="goldenHourStart" stroke="#facc15" name="Golden Hour Start" />
          <Line type="monotone" dataKey="sunrise" stroke="#2563eb" name="Sunrise" />
          <Line type="monotone" dataKey="sunset" stroke="#dc2626" name="Sunset" />
          <Line type="monotone" dataKey="goldenHourEnd" stroke="#facc15" strokeDasharray="5 5" name="Golden Hour End" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SunChart;
