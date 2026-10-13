import CrudPage from '../components/CrudPage.jsx';

const fields = [
  { name: 'fullName', label: 'Full name' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone' },
];

const columns = [
  { label: 'Name', render: (r) => <strong>{r.fullName}</strong> },
  { label: 'Email', render: (r) => r.email || '–' },
  { label: 'Phone', render: (r) => r.phone || '–' },
];

export default function Tenants() {
  return <CrudPage title="Tenants" noun="tenant" endpoint="/tenants" fields={fields} columns={columns} />;
}
