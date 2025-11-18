// URL base del backend para autos
const API_URL = "http://localhost:3000/api/autos";

/**
 * Obtener todos los autos
 */
export const obtenerTodosLosAutos = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error al obtener autos");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerTodosLosAutos:", error);
    throw error;
  }
};

/**
 * Crear un nuevo auto
 */
export const crearAuto = async (auto) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(auto),
    });
    if (!response.ok) {
      throw new Error("Error al crear el auto");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en crearAuto:", error);
    throw error;
  }
};

/**
 * Actualizar un auto existente
 */
export const actualizarAuto = async (id, auto) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(auto),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el auto");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en actualizarAuto:", error);
    throw error;
  }
};

/**
 * Eliminar un auto
 */
export const eliminarAuto = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el auto");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en eliminarAuto:", error);
    throw error;
  }
};
