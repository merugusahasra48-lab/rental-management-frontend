import CrudPage from '../components/CrudPage.jsx';
import { label, money } from '../api.js';

const fields = [
  { name: 'lease', label: 'Lease', ref: { endpoint: '/leases', label: (l) => `${l.tenant.fullName} – ${l.property.name}` } },
  { name: 'amount', label: 'Amount', type: 'number' },
  { name: 'paymentDate', label: 'Payment date', type: 'date', default: new Date().toISOString().slice(0, 10) },
  { name: 'method', label: 'Method', type: 'select', options: ['BANK_TRANSFER', 'UPI', 'CASH', 'CARD', 'CHEQUE'], default: 'BANK_TRANSFER' },
  { name: 'note', label: 'Note' },
];

const columns = [
  { label: 'Date', render: (r) => r.paymentDate },
  { label: 'Tenant', render: (r) => <strong>{r.lease.tenant.fullName}</strong> },
  { label: 'Property', render: (r) => r.lease.property.name },
  { label: 'Amount', render: (r) => money(r.amount) },
  { label: 'Method', render: (r) => label(r.method) },
  { label: 'Note', render: (r) => r.note || '–' },
];

export default function Payments() {
  return <CrudPage title="Payments" noun="payment" endpoint="/payments" fields={fields} columns={columns} />;
}
