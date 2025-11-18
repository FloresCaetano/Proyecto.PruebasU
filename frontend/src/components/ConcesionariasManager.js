import React, { useState, useEffect } from "react";
import ConcesionariaForm from "./ConcesionariaForm";
import ConcesionariasList from "./ConcesionariasList";
import {
  obtenerTodasLasConcesionarias,
  crearConcesionaria,
  actualizarConcesionaria,
  eliminarConcesionaria,
} from "../services/concesionariaService";

function ConcesionariasManager() {
  const [concesionarias, setConcesionarias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editConcesionaria, setEditConcesionaria] = useState(null);

  useEffect(() => {
    cargarConcesionarias();
  }, []);

  const cargarConcesionarias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerTodasLasConcesionarias();
      setConcesionarias(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar concesionarias");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async (concesionaria) => {
    setError(null);
    try {
      if (editConcesionaria) {
        await actualizarConcesionaria(editConcesionaria.id, concesionaria);
        setEditConcesionaria(null);
      } else {
        await crearConcesionaria(concesionaria);
      }
      await cargarConcesionarias();
    } catch (err) {
      setError(err.message || "Error al guardar");
    }
  };

  const handleEditar = (concesionaria) => {
    setEditConcesionaria(concesionaria);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta concesionaria?")) return;
    setError(null);
    try {
      await eliminarConcesionaria(id);
      await cargarConcesionarias();
    } catch (err) {
      setError(err.message || "Error al eliminar");
    }
  };

  const handleCancelar = () => {
    setEditConcesionaria(null);
  };

  return (
    <div>
      <section className="panel-section">
        {error && <div className="error">{error}</div>}
        <ConcesionariaForm
          onGuardar={handleGuardar}
          editConcesionaria={editConcesionaria}
          onCancelEdit={handleCancelar}
        />
      </section>

      <section className="panel-section">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ConcesionariasList
            concesionarias={concesionarias}
            onEliminar={handleEliminar}
            onEditar={handleEditar}
          />
        )}
      </section>
    </div>
  );
}

export default ConcesionariasManager;
