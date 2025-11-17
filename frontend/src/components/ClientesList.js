import React from "react";

function ClientesList({ clientes, onEliminar, onEditar }) {
  return (
    <div>
      <h2>Clientes Registrados</h2>
      {clientes.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", textAlign: "center" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Ciudad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.direccion}</td>
                <td>{cliente.ciudad}</td>
                <td>
                  <button onClick={() => onEditar(cliente)}>Editar</button>{" "}
                  <button onClick={() => onEliminar(cliente.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ClientesList;
