import React, { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

// --- Constantes y utilidades (definidas a nivel de módulo para evitar no-undef y referencias tempranas) ---
const marcasComunes = [
	"Toyota", "Honda", "Ford", "Chevrolet", "Nissan",
	"Volkswagen", "Hyundai", "Kia", "BMW", "Mercedes-Benz", "Audi"
];

const modelosPorMarca = {
	Toyota: ["Corolla", "Camry", "RAV4", "Hilux"],
	Honda: ["Civic", "Accord", "CR-V"],
	Ford: ["Fiesta", "Focus", "Mustang", "Explorer"],
	Chevrolet: ["Spark", "Cruze", "Camaro", "Trailblazer"],
	Nissan: ["Sentra", "Altima", "Qashqai"],
	Volkswagen: ["Golf", "Polo", "Jetta", "Tiguan"],
	Hyundai: ["Accent", "Elantra", "Tucson"],
	Kia: ["Rio", "Sportage", "Sorento"],
	BMW: ["3 Series", "5 Series", "X3"],
	"Mercedes-Benz": ["C-Class", "E-Class", "GLA"],
	Audi: ["A3", "A4", "Q5"]
};

const coloresComunes = [
	{ name: "Negro", hex: "#000000" },
	{ name: "Blanco", hex: "#FFFFFF" },
	{ name: "Rojo", hex: "#FF0000" },
	{ name: "Azul", hex: "#0000FF" },
	{ name: "Gris", hex: "#6B7280" },
	{ name: "Plata", hex: "#C0C0C0" },
	{ name: "Verde", hex: "#10B981" },
	{ name: "Amarillo", hex: "#F59E0B" }
];

function nombreAHex(name) {
	const found = coloresComunes.find(c => c.name === name);
	return found ? found.hex : "";
}
function hexParaNombre(hex) {
	if (!hex) return "";
	const found = coloresComunes.find(c => c.hex.toLowerCase() === String(hex).toLowerCase() || c.name.toLowerCase() === String(hex).toLowerCase());
	return found ? found.name : "";
}

// --- Componente principal ---
function EmpleadoDetalle({ detalle }) {
	// estado para autos (mantengo la funcionalidad previa)
	const [autos, setAutos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// modo de trabajo: autos | clientes | vendedores | concesionarias
	const [modo, setModo] = useState("autos");

	// formulario para autos
	const [form, setForm] = useState({
		id: null,
		marca: "",
		modelo: "",
		anio: "",
		color: "",
		numeroSerie: "",
	});

	// estado genérico para otras entidades
	const [items, setItems] = useState([]);
	const [entidadForm, setEntidadForm] = useState({ id: null });

	// configuración de entidades (campos)
	const entidadConfigs = {
		clientes: {
			endpoint: "clientes",
			fields: [
				{ name: "nombre", label: "Nombre", required: true },
				{ name: "email", label: "Email", required: true },
				{ name: "telefono", label: "Teléfono", required: true },
				{ name: "direccion", label: "Dirección", required: true },
				{ name: "ciudad", label: "Ciudad", required: true }
			]
		},
		vendedores: {
			endpoint: "vendedores",
			fields: [
				{ name: "nombreCompleto", label: "Nombre Completo", required: true },
				{ name: "email", label: "Email", required: true },
				{ name: "telefono", label: "Teléfono", required: true },
				{ name: "comision", label: "Comisión (%)", required: true },
				{ name: "codigoEmpleado", label: "Código Empleado", required: true }
			]
		},
		concesionarias: {
			endpoint: "concesionarias",
			fields: [
				{ name: "nombre", label: "Nombre", required: true },
				{ name: "direccion", label: "Dirección", required: true },
				{ name: "ciudad", label: "Ciudad", required: true },
				{ name: "telefono", label: "Teléfono", required: true },
				{ name: "gerente", label: "Gerente", required: true }
			]
		}
	};

	useEffect(() => {
		// carga inicial según modo
		if (modo === "autos") fetchAutos();
		else fetchEntities(modo);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modo]);

	async function fetchAutos() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`${API_BASE}/autos`);
			if (!res.ok) throw new Error("Error al obtener autos");
			const data = await res.json();
			const norm = (item) => ({
				...item,
				anio: item.anio ?? item["año"] ?? item.year ?? "",
				numeroSerie: (item.numeroSerie ?? item.placa ?? "").toString().toUpperCase(),
				color: hexParaNombre(item.color) || (item.color || ""),
			});
			setAutos(Array.isArray(data) ? data.map(norm) : []);
		} catch (err) {
			console.error("fetchAutos error", err);
			setError(err.message || "Error");
		} finally {
			setLoading(false);
		}
	}

	async function fetchEntities(selectedModo) {
		if (!entidadConfigs[selectedModo]) {
			setItems([]);
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const endpoint = entidadConfigs[selectedModo].endpoint;
			const res = await fetch(`${API_BASE}/${endpoint}`);
			if (!res.ok) throw new Error("Error al obtener datos");
			const data = await res.json();
			setItems(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error("fetchEntities error", err);
			setError(err.message || "Error");
		} finally {
			setLoading(false);
		}
	}

	// autos: helper functions
	function resetForm() {
		setForm({ id: null, marca: "", modelo: "", anio: "", color: "", numeroSerie: "" });
	}
	function handleChange(e) {
		const { name, value } = e.target;
		if (name === "marca") setForm(f => ({ ...f, marca: value, modelo: "" }));
		else if (name === "numeroSerie") setForm(f => ({ ...f, numeroSerie: (value || "").toString().toUpperCase() }));
		else setForm(f => ({ ...f, [name]: value }));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		const anioNum = Number(form.anio);
		if (Number.isNaN(anioNum) || anioNum < 1900) {
			setError("El año debe ser un número válido y como mínimo 1900");
			return;
		}
		if (!form.modelo) {
			setError("Selecciona un modelo válido para la marca seleccionada");
			return;
		}
		try {
			const payload = {
				marca: form.marca,
				modelo: form.modelo,
				año: anioNum,
				color: form.color, // nombre del color
				numeroSerie: (form.numeroSerie || "").toString().toUpperCase(),
			};
			let res;
			if (form.id) {
				res = await fetch(`${API_BASE}/autos/${form.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
			} else {
				res = await fetch(`${API_BASE}/autos`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
			}
			if (!res.ok) {
				const txt = await res.text().catch(() => null);
				throw new Error(txt || "Error en la operación con el servidor");
			}
			resetForm();
			await fetchAutos();
		} catch (err) {
			console.error("handleSubmit autos error", err);
			setError(err.message || "Error al guardar");
		}
	}

	function handleEdit(auto) {
		setForm({
			id: auto.id ?? auto._id ?? null,
			marca: auto.marca ?? "",
			modelo: auto.modelo ?? "",
			anio: auto.anio ?? auto["año"] ?? "",
			color: hexParaNombre(auto.color) || (auto.color ?? ""),
			numeroSerie: (auto.numeroSerie ?? auto.placa ?? "").toString().toUpperCase(),
		});
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	async function handleDelete(id) {
		if (!window.confirm("¿Eliminar este auto?")) return;
		setError(null);
		try {
			const res = await fetch(`${API_BASE}/autos/${id}`, { method: "DELETE" });
			if (!res.ok) {
				const txt = await res.text().catch(() => null);
				throw new Error(txt || "Error al eliminar");
			}
			await fetchAutos();
		} catch (err) {
			console.error("handleDelete autos error", err);
			setError(err.message || "Error al eliminar");
		}
	}

	// entidades genéricas: clientes/vendedores/concesionarias
	function resetEntidadForm() {
		setEntidadForm({ id: null });
	}
	function handleEntidadChange(e) {
		const { name, value } = e.target;
		if (name === "numeroSerie") setEntidadForm(f => ({ ...f, [name]: (value || "").toString().toUpperCase() }));
		else setEntidadForm(f => ({ ...f, [name]: value }));
	}

	async function handleEntidadSubmit(e) {
		e.preventDefault();
		setError(null);
		const cfg = entidadConfigs[modo];
		if (!cfg) return;
		for (const fld of cfg.fields) {
			if (fld.required && !entidadForm[fld.name]) {
				setError(`El campo "${fld.label}" es requerido`);
				return;
			}
		}
		try {
			const payload = { ...entidadForm };
			if (payload.dni) payload.dni = String(payload.dni).toUpperCase();
			if (payload.codigoEmpleado) payload.codigoEmpleado = String(payload.codigoEmpleado).toUpperCase();
			let res;
			if (entidadForm.id) {
				res = await fetch(`${API_BASE}/${cfg.endpoint}/${entidadForm.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
			} else {
				res = await fetch(`${API_BASE}/${cfg.endpoint}`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
			}
			if (!res.ok) {
				const txt = await res.text().catch(() => null);
				throw new Error(txt || "Error en la operación con el servidor");
			}
			resetEntidadForm();
			await fetchEntities(modo);
		} catch (err) {
			console.error("handleEntidadSubmit error", err);
			setError(err.message || "Error al guardar");
		}
	}

	function handleEntidadEdit(item) {
		const init = { id: item.id ?? item._id ?? null };
		const cfg = entidadConfigs[modo];
		for (const f of (cfg?.fields || [])) {
			init[f.name] = item[f.name] ?? "";
		}
		if (init.numeroSerie) init.numeroSerie = String(init.numeroSerie).toUpperCase();
		if (init.dni) init.dni = String(init.dni).toUpperCase();
		setEntidadForm(init);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	async function handleEntidadDelete(id) {
		if (!window.confirm("¿Eliminar este registro?")) return;
		setError(null);
		try {
			const cfg = entidadConfigs[modo];
			const res = await fetch(`${API_BASE}/${cfg.endpoint}/${id}`, { method: "DELETE" });
			if (!res.ok) {
				const txt = await res.text().catch(() => null);
				throw new Error(txt || "Error al eliminar");
			}
			await fetchEntities(modo);
		} catch (err) {
			console.error("handleEntidadDelete error", err);
			setError(err.message || "Error al eliminar");
		}
	}

	// Render: protecciones para evitar map sobre undefined
	return (
		<div className="panel">
			<h2 className="panel-title">Gestión de Concesionarias</h2>
			<p className="panel-subtitle">
				Usuario: {detalle?.nombreCompleto || "N/A"} — ID: {detalle?.id || "N/A"}
			</p>

			<nav className="panel-nav">
				<button className="nav-btn" onClick={() => setModo("autos")} disabled={modo === "autos"}>
					Autos
				</button>
				<button className="nav-btn" onClick={() => setModo("clientes")} disabled={modo === "clientes"}>
					Clientes
				</button>
				<button className="nav-btn" onClick={() => setModo("vendedores")} disabled={modo === "vendedores"}>
					Vendedores (próximo)
				</button>
				<button className="nav-btn" onClick={() => setModo("concesionarias")} disabled={modo === "concesionarias"}>
					Concesionarias (próximo)
				</button>
			</nav>

			{modo === "autos" && (
				<div>
					<section className="panel-section">
						<h3 className="section-heading">{form.id ? "Editar Auto" : "Crear Auto"}</h3>
						{error && <div className="error">{error}</div>}
						<form onSubmit={handleSubmit}>
							<div className="form-row">
								<label>Marca:</label>
								<select className="input select" name="marca" value={form.marca} onChange={handleChange} required>
									<option value="">-- Selecciona una marca --</option>
									{marcasComunes.map(m => <option key={m} value={m}>{m}</option>)}
								</select>
							</div>

							<div className="form-row">
								<label>Modelo:</label>
								<select className="input select" name="modelo" value={form.modelo} onChange={handleChange} required>
									<option value="">-- Selecciona un modelo --</option>
									{(modelosPorMarca[form.marca] || []).map(mod => <option key={mod} value={mod}>{mod}</option>)}
								</select>
							</div>

							<div className="form-row">
								<label>Año:</label>
								<input className="input" name="anio" type="number" min="1900" value={form.anio} onChange={handleChange} required />
							</div>

							<div className="form-row">
								<label>Color:</label>
								<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
									<select className="input select" name="color" value={form.color} onChange={handleChange}>
										<option value="">-- Selecciona un color --</option>
										{coloresComunes.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
									</select>
									<div aria-hidden style={{
										width: 20, height: 20, borderRadius: 4, border: "1px solid #e6e9ef",
										background: nombreAHex(form.color) || "transparent"
									}}/>
								</div>
							</div>

							<div className="form-row">
								<label>Número de Serie / Placa:</label>
								<input className="input" name="numeroSerie" value={form.numeroSerie} onChange={handleChange} required />
							</div>

							<div className="form-actions">
								<button className="btn" type="submit">{form.id ? "Actualizar" : "Crear"}</button>
								<button className="btn secondary" type="button" onClick={resetForm}>Limpiar</button>
							</div>
						</form>
					</section>

					<section className="panel-section">
						<h3 className="section-heading">Listado de Autos</h3>
						{loading ? <p>Cargando...</p> : autos.length === 0 ? <p>No hay autos registrados.</p> : (
							<table className="panel-table">
								<thead>
									<tr>
										<th>ID</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Color</th><th>N.º Serie / Placa</th><th>Acciones</th>
									</tr>
								</thead>
								<tbody>
									{autos.map(a => (
										<tr key={a.id ?? a._id}>
											<td>{a.id ?? a._id}</td>
											<td>{a.marca}</td>
											<td>{a.modelo}</td>
											<td>{a.anio}</td>
											<td>{a.color}</td>
											<td>{(a.numeroSerie || "").toString().toUpperCase()}</td>
											<td>
												<button className="action-btn edit" onClick={() => handleEdit(a)}>Editar</button>
												<button className="action-btn delete" onClick={() => handleDelete(a.id ?? a._id)}>Borrar</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</section>
				</div>
			)}

			{modo === "clientes" && (
				<div>
					<section className="panel-section">
						<h3 className="section-heading">{entidadForm.id ? "Editar Cliente" : "Crear Cliente"}</h3>
						{error && <div className="error">{error}</div>}
						<form onSubmit={handleEntidadSubmit}>
							{entidadConfigs.clientes.fields.map(field => (
								<div className="form-row" key={field.name}>
									<label>{field.label}:</label>
									<input
										className="input"
										name={field.name}
										type={field.name === "email" ? "email" : "text"}
										value={entidadForm[field.name] || ""}
										onChange={handleEntidadChange}
										required={field.required}
									/>
								</div>
							))}
							<div className="form-actions">
								<button className="btn" type="submit">{entidadForm.id ? "Actualizar" : "Crear"}</button>
								<button className="btn secondary" type="button" onClick={resetEntidadForm}>Limpiar</button>
							</div>
						</form>
					</section>

					<section className="panel-section">
						<h3 className="section-heading">Listado de Clientes</h3>
						{loading ? <p>Cargando...</p> : items.length === 0 ? <p>No hay clientes registrados.</p> : (
							<table className="panel-table">
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
									{items.map(item => (
										<tr key={item.id ?? item._id}>
											<td>{item.id ?? item._id}</td>
											<td>{item.nombre}</td>
											<td>{item.email}</td>
											<td>{item.telefono}</td>
											<td>{item.direccion}</td>
											<td>{item.ciudad}</td>
											<td>
												<button className="action-btn edit" onClick={() => handleEntidadEdit(item)}>Editar</button>
												<button className="action-btn delete" onClick={() => handleEntidadDelete(item.id ?? item._id)}>Borrar</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</section>
				</div>
			)}

			{modo !== "autos" && modo !== "clientes" && (
				<div style={{ marginTop: "1rem", padding: "1rem", background: "#fffbe6", borderRadius: 6 }}>
					<h3>{modo.charAt(0).toUpperCase() + modo.slice(1)}</h3>
					<p>Interfaz para {modo} no implementada aún. Se añadirá en futuras iteraciones.</p>
				</div>
			)}
		</div>
	);
}

export default EmpleadoDetalle;