import React, { useState, useEffect } from "react";
import {
  obtenerTodosLosVendedores,
  crearVendedor,
  actualizarVendedor,
  eliminarVendedor,
} from "../services/vendedorService";

function VendedoresManager() {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    telefono: "",
    comision: "",
    codigoEmpleado: "",
  });

  useEffect(() => {
    cargarVendedores();
  }, []);

  const cargarVendedores = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerTodosLosVendedores();
      setVendedores(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar vendedores");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ id: null, name: "", email: "", telefono: "", comision: "", codigoEmpleado: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "codigoEmpleado") {
      setForm(f => ({ ...f, [name]: value.toUpperCase() }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.telefono || !form.comision || !form.codigoEmpleado) {
      setError("Todos los campos son requeridos");
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        telefono: form.telefono,
        comision: form.comision,
        codigoEmpleado: form.codigoEmpleado.toUpperCase(),
      };

      if (form.id) {
        await actualizarVendedor(form.id, payload);
      } else {
        await crearVendedor(payload);
      }

      resetForm();
      await cargarVendedores();
    } catch (err) {
      setError(err.message || "Error al guardar");
    }
  };

  const handleEdit = (vendedor) => {
    setForm({
      id: vendedor.id ?? vendedor._id ?? null,
      name: vendedor.name ?? "",
      email: vendedor.email ?? "",
      telefono: vendedor.telefono ?? "",
      comision: vendedor.comision ?? "",
      codigoEmpleado: vendedor.codigoEmpleado ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este vendedor?")) return;
    setError(null);
    try {
      await eliminarVendedor(id);
      await cargarVendedores();
    } catch (err) {
      setError(err.message || "Error al eliminar");
    }
  };

  return (
    <div>
      <section className="panel-section">
        <h3 className="section-heading">{form.id ? "Editar Vendedor" : "Crear Vendedor"}</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Nombre Completo:</label>
            <input
              className="input"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Email:</label>
            <input
              className="input"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Teléfono:</label>
            <input
              className="input"
              name="telefono"
              type="text"
              value={form.telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Comisión (%):</label>
            <input
              className="input"
              name="comision"
              type="text"
              value={form.comision}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Código Empleado:</label>
            <input
              className="input"
              name="codigoEmpleado"
              type="text"
              value={form.codigoEmpleado}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button className="btn" type="submit">{form.id ? "Actualizar" : "Crear"}</button>
            <button className="btn secondary" type="button" onClick={resetForm}>Limpiar</button>
          </div>
        </form>
      </section>

      <section className="panel-section">
        <h3 className="section-heading">Listado de Vendedores</h3>
        {loading ? <p>Cargando...</p> : vendedores.length === 0 ? <p>No hay vendedores registrados.</p> : (
          <table className="panel-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Comisión</th>
                <th>Código de Empleado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vendedores.map(v => (
                <tr key={v.id ?? v._id}>
                  <td>{v.id ?? v._id}</td>
                  <td>{v.name}</td>
                  <td>{v.email}</td>
                  <td>{v.telefono}</td>
                  <td>{v.comision}</td>
                  <td>{v.codigoEmpleado}</td>
                  <td>
                    <button className="action-btn edit" onClick={() => handleEdit(v)}>Editar</button>
                    <button className="action-btn delete" onClick={() => handleDelete(v.id ?? v._id)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default VendedoresManager;
