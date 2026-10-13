import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Properties from './pages/Properties.jsx';
import Tenants from './pages/Tenants.jsx';
import Leases from './pages/Leases.jsx';
import Payments from './pages/Payments.jsx';

const links = [
  ['/', 'Dashboard'],
  ['/properties', 'Properties'],
  ['/tenants', 'Tenants'],
  ['/leases', 'Leases'],
  ['/payments', 'Payments'],
];

export default function App() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">Rental Manager</div>
        <nav>
          {links.map(([to, text]) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {text}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/leases" element={<Leases />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
      </main>
    </div>
  );
}
