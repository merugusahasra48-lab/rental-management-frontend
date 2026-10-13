import { useEffect, useState } from 'react';
import api, { money } from '../api.js';

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api.get('/dashboard').then((r) => setS(r.data)).catch(() => setFailed(true));
  }, []);

  if (failed) return <p className="error">Could not load the dashboard. Check that the backend is running on port 8080.</p>;
  if (!s) return <p>Loading…</p>;

  const pct = (n) => (s.totalProperties ? (n / s.totalProperties) * 100 : 0);

  return (
    <section>
      <header className="page-head">
        <h1>Dashboard</h1>
      </header>

      <div className="rent-roll panel">
        <p className="muted">Monthly rent roll from active leases</p>
        <p className="big">{money(s.monthlyRentRoll)}</p>
        <p className="muted">{money(s.totalCollected)} collected to date</p>
      </div>

      <div className="panel">
        <h2>Occupancy across {s.totalProperties} properties</h2>
        <div className="bar" role="img" aria-label={`${s.occupied} occupied, ${s.available} available, ${s.maintenance} in maintenance`}>
          <span className="seg occupied" style={{ width: `${pct(s.occupied)}%` }} />
          <span className="seg available" style={{ width: `${pct(s.available)}%` }} />
          <span className="seg maintenance" style={{ width: `${pct(s.maintenance)}%` }} />
        </div>
        <ul className="legend">
          <li><i className="dot occupied" /> {s.occupied} occupied</li>
          <li><i className="dot available" /> {s.available} available</li>
          <li><i className="dot maintenance" /> {s.maintenance} in maintenance</li>
        </ul>
      </div>

      <div className="stats">
        <div className="panel"><p className="muted">Active leases</p><p className="num">{s.activeLeases}</p></div>
        <div className="panel"><p className="muted">Tenants</p><p className="num">{s.totalTenants}</p></div>
      </div>
    </section>
  );
}
