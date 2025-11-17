import React, { useState, useEffect } from "react";

function ClienteForm({ onGuardar, editCliente, onCancelEdit }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
  });

  useEffect(() => {
    if (editCliente) {
      setForm(editCliente);
    }
  }, [editCliente]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Envía los datos
    onGuardar(form);

    // Limpia el formulario
    setForm({
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
      ciudad: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editCliente ? "Editar Cliente" : "Nuevo Cliente"}</h2>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "5px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "5px", width: "300px" }}
        />
        <input
          type="text"
          name="ciudad"
          placeholder="Ciudad"
          value={form.ciudad}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "5px" }}
        />
      </div>
      <button type="submit">{editCliente ? "Actualizar" : "Guardar"}</button>

      {editCliente && (
        <button
          type="button"
          onClick={onCancelEdit}
          style={{ marginLeft: "10px" }}
        >
          Cancelar
        </button>
      )}
    </form>
  );
}

export default ClienteForm;
