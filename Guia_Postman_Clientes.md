# Guía de Pruebas Manuales con Postman - Módulo Clientes

Esta guía detalla paso a paso cómo probar los endpoints del backend para la gestión de Clientes, incluyendo la autenticación requerida.

## 1. Requisitos Previos

*   Asegúrate de que el backend esté ejecutándose:
    ```powershell
    cd Backend/src
    node app.js
    ```
*   Tener instalado Postman.

---

## 2. Autenticación (Paso Obligatorio)

Antes de gestionar clientes, necesitas obtener un Token de acceso.

1.  **Crear nueva Petición** en Postman.
2.  **Método**: Selecciona `POST`.
3.  **URL**: `http://localhost:3000/api/auth/login`
4.  **Body**:
    *   Ve a la pestaña **Body**.
    *   Selecciona **raw**.
    *   En el menú desplegable (derecha), cambia "Text" por **JSON**.
    *   Pega el siguiente JSON:
        ```json
        {
            "email": "admin@consecionaria.com",
            "password": "consesionariachida"
        }
        ```
5.  **Enviar**: Dale click a **Send**.
6.  **Resultado**: Copia el código largo que aparece en `token` en la respuesta.

---

## 3. Operaciones CRUD Clientes

Para todas las siguientes peticiones, debes configurar la autorización:
*   Ve a la pestaña **Authorization**.
*   En **Type**, selecciona **Bearer Token**.
*   En el campo **Token**, pega el código que copiaste en el paso anterior.

### A. Crear Cliente (Check de Escritura)

*   **Método**: `POST`
*   **URL**: `http://localhost:3000/api/clientes`
*   **Body** (Recuerda seleccionar JSON):
    ```json
    {
        "nombre": "Esteban Dido",
        "email": "esteban.dido@example.com",
        "telefono": "0987654321",
        "direccion": "Calle Falsa 123",
        "ciudad": "Quito"
    }
    ```
*   **Nota**: Copia el `id` que te devuelve la respuesta para usarlo después.

### B. Listar Clientes (Check de Lectura)

*   **Método**: `GET`
*   **URL**: `http://localhost:3000/api/clientes`
*   **Body**: Ninguno (selecciona "none").

### C. Actualizar Cliente (Check de Edición)

*   **Método**: `PUT`
*   **URL**: `http://localhost:3000/api/clientes/ID_DEL_CLIENTE`
    *   *Reemplaza `ID_DEL_CLIENTE` por el número que copiaste al crear.*
*   **Body** (JSON):
    ```json
    {
        "telefono": "0991112233",
        "ciudad": "Cuenca"
    }
    ```

### D. Eliminar Cliente (Check de Borrado)

*   **Método**: `DELETE`
*   **URL**: `http://localhost:3000/api/clientes/ID_DEL_CLIENTE`
*   **Body**: Ninguno.

---

## 4. Solución de Problemas Comunes

| Error | Causa Probable | Solución |
| :--- | :--- | :--- |
| `404 Not Found` | URL incorrecta o Método incorrecto | Verifica que uses `POST` para login/crear y la URL termine en `/api/clientes`. |
| `TypeError ... req.body undefined` | Formato de Body incorrecto | En la pestaña **Body**, asegúrate de que esté seleccionado **JSON** y no "Text". |
| `401 Unauthorized` | Token faltante o inválido | Revisa la pestaña **Authorization**, selecciona **Bearer Token** y pega el token nuevamente. |
