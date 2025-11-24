
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

function WorldClockInner() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const getTime = (tz: string) =>
    now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: tz });
  return (
    <div className="nav-world-clock">
      <div className="nav-clock-row">
        <span className="nav-clock-label">🇰🇷 KOR</span>
        <span className="nav-clock-time">{getTime('Asia/Seoul')}</span>
      </div>
      <div className="nav-clock-row">
        <span className="nav-clock-label">🇮🇩 IDN</span>
        <span className="nav-clock-time">{getTime('Asia/Jakarta')}</span>
      </div>
    </div>
  );
}

const WorldClock = dynamic(() => Promise.resolve(WorldClockInner), { ssr: false });
export default WorldClock;
