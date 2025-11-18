import React, { useState, useEffect } from "react";
import ClienteForm from "./ClienteForm";
import ClientesList from "./ClientesList";
import {
  obtenerTodosLosClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "../services/clienteService";

function ClientesManager() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editCliente, setEditCliente] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerTodosLosClientes();
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async (cliente) => {
    setError(null);
    try {
      if (editCliente) {
        await actualizarCliente(editCliente.id, cliente);
        setEditCliente(null);
      } else {
        await crearCliente(cliente);
      }
      await cargarClientes();
    } catch (err) {
      setError(err.message || "Error al guardar");
    }
  };

  const handleEditar = (cliente) => {
    setEditCliente(cliente);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este cliente?")) return;
    setError(null);
    try {
      await eliminarCliente(id);
      await cargarClientes();
    } catch (err) {
      setError(err.message || "Error al eliminar");
    }
  };

  const handleCancelar = () => {
    setEditCliente(null);
  };

  return (
    <div>
      <section className="panel-section">
        {error && <div className="error">{error}</div>}
        <ClienteForm
          onGuardar={handleGuardar}
          editCliente={editCliente}
          onCancelEdit={handleCancelar}
        />
      </section>

      <section className="panel-section">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ClientesList
            clientes={clientes}
            onEliminar={handleEliminar}
            onEditar={handleEditar}
          />
        )}
      </section>
    </div>
  );
}

export default ClientesManager;
