import { useEffect, useState } from 'react';
import api from '../api.js';

/**
 * One reusable list + form screen.
 *  fields:  [{ name, label, type: text|number|date|email|select|checkbox, options?, ref?: { endpoint, label(row) }, default? }]
 *  columns: [{ label, render(row) }]
 */
export default function CrudPage({ title, noun, endpoint, fields, columns }) {
  const [rows, setRows] = useState([]);
  const [refs, setRefs] = useState({});
  const [form, setForm] = useState(null); // null = form closed
  const [error, setError] = useState('');

  const load = () => api.get(endpoint).then((r) => setRows(r.data));

  useEffect(() => {
    load();
    fields
      .filter((f) => f.ref)
      .forEach((f) => api.get(f.ref.endpoint).then((r) => setRefs((p) => ({ ...p, [f.name]: r.data }))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const openNew = () => {
    setError('');
    setForm(Object.fromEntries(fields.map((f) => [f.name, f.default ?? (f.type === 'checkbox' ? false : '')])));
  };

  const openEdit = (row) => {
    setError('');
    const values = fields.map((f) => [f.name, f.ref ? row[f.name]?.id ?? '' : row[f.name] ?? (f.type === 'checkbox' ? false : '')]);
    setForm({ ...Object.fromEntries(values), id: row.id });
  };

  const set = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const toMessage = (err) => {
    const data = err.response?.data;
    if (data?.errors) return Object.values(data.errors).join('. ');
    return data?.message || 'Could not reach the server. Check that the backend is running.';
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    fields.forEach((f) => {
      const v = form[f.name];
      if (f.ref) payload[f.name] = v ? { id: Number(v) } : null;
      else if (f.type === 'number') payload[f.name] = v === '' ? null : Number(v);
      else if (f.type === 'date' && v === '') payload[f.name] = null;
    });
    try {
      if (form.id) await api.put(`${endpoint}/${form.id}`, payload);
      else await api.post(endpoint, payload);
      setForm(null);
      load();
    } catch (err) {
      setError(toMessage(err));
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete this ${noun}? This cannot be undone.`)) return;
    try {
      await api.delete(`${endpoint}/${row.id}`);
      load();
    } catch (err) {
      window.alert(toMessage(err));
    }
  };

  const renderInput = (f) => {
    const common = { id: f.name, value: form[f.name] ?? '', onChange: (e) => set(f.name, e.target.value) };
    if (f.ref)
      return (
        <select {...common}>
          <option value="">Select {f.label.toLowerCase()}</option>
          {(refs[f.name] || []).map((r) => (
            <option key={r.id} value={r.id}>
              {f.ref.label(r)}
            </option>
          ))}
        </select>
      );
    if (f.type === 'select')
      return (
        <select {...common}>
          {f.options.map((o) => (
            <option key={o} value={o}>
              {o.charAt(0) + o.slice(1).toLowerCase().replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      );
    if (f.type === 'checkbox')
      return <input id={f.name} type="checkbox" checked={!!form[f.name]} onChange={(e) => set(f.name, e.target.checked)} />;
    return <input {...common} type={f.type || 'text'} step={f.type === 'number' ? 'any' : undefined} />;
  };

  return (
    <section>
      <header className="page-head">
        <h1>{title}</h1>
        <button className="btn primary" onClick={openNew}>
          Add {noun}
        </button>
      </header>

      {form && (
        <form className="panel form-grid" onSubmit={submit}>
          <h2>{form.id ? `Edit ${noun}` : `New ${noun}`}</h2>
          {fields.map((f) => (
            <div key={f.name} className={f.type === 'checkbox' ? 'field inline' : 'field'}>
              <label htmlFor={f.name}>{f.label}</label>
              {renderInput(f)}
            </div>
          ))}
          {error && <p className="error">{error}</p>}
          <div className="actions">
            <button type="submit" className="btn primary">
              Save {noun}
            </button>
            <button type="button" className="btn" onClick={() => setForm(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.label}>{c.label}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="empty">
                  No {noun}s yet. Select “Add {noun}” to create the first one.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((c) => (
                  <td key={c.label}>{c.render(row)}</td>
                ))}
                <td className="row-actions">
                  <button className="link" onClick={() => openEdit(row)}>
                    Edit
                  </button>
                  <button className="link danger" onClick={() => remove(row)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
