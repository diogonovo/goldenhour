import './SunTimeline.css';

function parseTimeToMinutes(timeStr) {
  if (!timeStr || !/^\d{2}:\d{2}$/.test(timeStr)) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatHour(minutes) {
  if (typeof minutes !== 'number' || minutes < 0 || minutes > 1440) return '--:--';
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

function SunTimeline({ sunrise, sunset, twilightStart, twilightEnd, date }) {
  const totalMinutes = 1440;

  const twilightStartMin = parseTimeToMinutes(twilightStart);
  const sunriseMin = parseTimeToMinutes(sunrise);
  const sunsetMin = parseTimeToMinutes(sunset);
  const twilightEndMin = parseTimeToMinutes(twilightEnd);

  const invalidData = [twilightStartMin, sunriseMin, sunsetMin, twilightEndMin].some(
    (v) => v === null || isNaN(v) || v < 0 || v > 1440
  );

  const incoerente =
    invalidData ||
    twilightStartMin >= sunriseMin ||
    sunsetMin >= twilightEndMin ||
    sunriseMin >= sunsetMin;

  if (incoerente) {
    return (
      <div className="sun-timeline-wrapper">
        <div className="sun-timeline">
          <div
            className="interval night"
            style={{ width: '100%' }}
            title="Sem dados solares válidos para este dia."
          />
        </div>
        <div className="sun-events">
          <div>🌅⬆️ {sunrise}</div>
          <div>{date}</div>
          <div>🌇⬇️ {sunset}</div>
        </div>
      </div>
    );
  }

  const goldenDuration = sunriseMin - twilightStartMin;
  const goldenMorningEnd = sunriseMin + goldenDuration;
  const goldenEveningStart = sunsetMin - goldenDuration;
  
  const segments = [
  {
    className: 'night',
    start: 0,
    end: twilightStartMin,
    label: `Noite das 00:00 às ${formatHour(twilightStartMin)}`
  },
  {
    className: 'golden',
    start: twilightStartMin,
    end: goldenMorningEnd,
    label: `Golden Hour das ${formatHour(twilightStartMin)} às ${formatHour(goldenMorningEnd)}`
  },
  {
    className: 'day',
    start: goldenMorningEnd,
    end: goldenEveningStart,
    label: `Dia das ${formatHour(goldenMorningEnd)} às ${formatHour(goldenEveningStart)}`
  },
  {
    className: 'golden',
    start: goldenEveningStart,
    end: twilightEndMin,
    label: `Golden Hour das ${formatHour(goldenEveningStart)} às ${formatHour(twilightEndMin)}`
  },
  {
    className: 'night',
    start: twilightEndMin,
    end: totalMinutes,
    label: `Noite das ${formatHour(twilightEndMin)} às 00:00`
  }
  ];


  return (
    <div className="sun-timeline-wrapper">
      <div className="sun-timeline">
        {segments.map((seg, idx) => {
          const width = ((seg.end - seg.start) / totalMinutes) * 100;
          const left = (seg.start / totalMinutes) * 100;

          return (
            <div
              key={idx}
              className={`interval ${seg.className}`}
              style={{ left: `${left}%`, width: `${width}%` }}
              title={seg.label}
            />
          );
        })}
      </div>

      <div className="sun-events">
        <div>🌅⬆️ {sunrise}</div>
        <div>{date}</div>
        <div>🌇⬇️ {sunset}</div>
      </div>
    </div>
  );
}

export default SunTimeline;
