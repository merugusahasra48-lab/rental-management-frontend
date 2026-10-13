import CrudPage from '../components/CrudPage.jsx';
import { label, money } from '../api.js';

const fields = [
  { name: 'name', label: 'Name' },
  { name: 'address', label: 'Address' },
  { name: 'city', label: 'City' },
  { name: 'type', label: 'Type', type: 'select', options: ['APARTMENT', 'HOUSE', 'VILLA', 'COMMERCIAL'], default: 'APARTMENT' },
  { name: 'bedrooms', label: 'Bedrooms', type: 'number' },
  { name: 'monthlyRent', label: 'Monthly rent', type: 'number' },
  { name: 'status', label: 'Status', type: 'select', options: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'], default: 'AVAILABLE' },
];

const columns = [
  { label: 'Property', render: (r) => <strong>{r.name}</strong> },
  { label: 'Location', render: (r) => [r.address, r.city].filter(Boolean).join(', ') },
  { label: 'Type', render: (r) => label(r.type) },
  { label: 'Beds', render: (r) => r.bedrooms ?? '–' },
  { label: 'Rent', render: (r) => money(r.monthlyRent) },
  { label: 'Status', render: (r) => <span className={`badge ${r.status.toLowerCase()}`}>{label(r.status)}</span> },
];

export default function Properties() {
  return <CrudPage title="Properties" noun="property" endpoint="/properties" fields={fields} columns={columns} />;
}
