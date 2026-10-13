import CrudPage from '../components/CrudPage.jsx';
import { money } from '../api.js';

const fields = [
  { name: 'property', label: 'Property', ref: { endpoint: '/properties', label: (p) => `${p.name} (${p.city || p.address})` } },
  { name: 'tenant', label: 'Tenant', ref: { endpoint: '/tenants', label: (t) => t.fullName } },
  { name: 'startDate', label: 'Start date', type: 'date' },
  { name: 'endDate', label: 'End date', type: 'date' },
  { name: 'monthlyRent', label: 'Monthly rent', type: 'number' },
  { name: 'deposit', label: 'Security deposit', type: 'number' },
  { name: 'active', label: 'Lease is active', type: 'checkbox', default: true },
];

const columns = [
  { label: 'Property', render: (r) => <strong>{r.property.name}</strong> },
  { label: 'Tenant', render: (r) => r.tenant.fullName },
  { label: 'Term', render: (r) => `${r.startDate} → ${r.endDate || 'open'}` },
  { label: 'Rent', render: (r) => money(r.monthlyRent) },
  { label: 'Deposit', render: (r) => (r.deposit ? money(r.deposit) : '–') },
  { label: 'Status', render: (r) => <span className={`badge ${r.active ? 'occupied' : 'maintenance'}`}>{r.active ? 'Active' : 'Ended'}</span> },
];

export default function Leases() {
  return <CrudPage title="Leases" noun="lease" endpoint="/leases" fields={fields} columns={columns} />;
}
