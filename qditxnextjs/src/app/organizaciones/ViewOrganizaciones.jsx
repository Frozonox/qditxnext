"use client";
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './ViewOrganizaciones.modules.css'
import LoadScreen from "../LoadScreen";
// import { BiSearch, BiRefresh } from "react-bootstrap-icons";

export default function ViewOrganizaciones() {
	const [companys, setCompanys] = useState([]);
	const [results, setResults] = useState([]);
	const [pageNumber, setPageNumber] = useState(0);
	const isFirstRender = useRef(true);
	const [nit, setNit] = useState("");
	const [ncompany, setNcompany] = useState("");
	const [csector, setCsector] = useState("");

	const [ccountry, setCcountry] = useState("");
	const [ccity, setCcity] = useState("");
	const [estado, setEstado] = useState("");
	const [fechaInicio, setFechaInicio] = useState("");
	const [fechaFin, setFechaFin] = useState("");

	const [isLoading, setLoad]= useState(true);

	const getCompanys = async (page, filters) => {
		try {
			let url = `http://localhost:8080/companys?page=${page}`;
			if (filters) {
				const filters = [
					page,
					nit,
					ncompany,
					csector,
					ccountry,
					ccity,
					estado,
					fechaInicio,
					fechaFin,
				];

				if (nit) {
					url += `&nit=${nit}`;
				}

				if (ncompany) {
					url += `&ncompany=${ncompany}`;
				}

				if (csector) {
					url += `&csector=${csector}`;
				}

				if (ccity) {
					url += `&ccity=${ccity}`;
				}

				if (ccountry) {
					url += `&ccountry=${ccountry}`;
				}
				if (estado) {
					url += `&estado=${estado}`;
				}
				if (fechaInicio) {
					url += `&fechaInicio=${fechaInicio}`;
				}
				if (fechaInicio) {
					url += `&fechaFin=${fechaFin}`;
				}
			}
			console.log("URL " + url);
			setLoad(true);
			const response = await fetch(url);
			const jsonData = await response.json();
			setCompanys(jsonData);
			setResults(jsonData);
			setLoad(false);
			console.log(setCompanys);
		} catch (err) {
			console.error(err.message);
		}
	};

	useEffect(() => {
		// Evita que se ejecute durante la renderización inicial "indefinida"
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		getCompanys(pageNumber);
	}, [pageNumber]);
	function buscar() {
		getCompanys(0, {
			nit,
			ncompany,
			csector,
			ccountry,
			ccity,
			estado,
			fechaInicio,
			fechaFin,
		});
	}
	function limpiar() {
		const initialFilters = {
			nit: "",
			ncompany: "",
			csector: "",
			ccountry: "",
			ccity: "",
			estado: "",
			fechaInicio: "",
			fechaFin: "",
		};

		getCompanys(0, initialFilters);
		setNit("");
		setNcompany("");
		setCcountry("");
		setCcity("");
		setCsector("");
		setEstado("");
		setFechaInicio("");
		setFechaFin("");
		setResults(companys);
		setPageNumber(0);
	}

	function paginacion(page) {
		if (page === 1) {
			setPageNumber(pageNumber + 1);
		} else if (page === 0 && pageNumber > 0) {
			setPageNumber(pageNumber - 1);
		}
		getCompanys(pageNumber);
	}

	return (
		<>

		{isLoading ? (
			<LoadScreen />
		):(

			<div>
					<div className="Header">
			<h1 className="text-light center text-center">Lista de Entidades</h1>

			<div className="row justify-content-end">
				<div className="col-md-2">
					<input
						value={nit}
						onChange={(e) => {
							setNit(e.target.value);
						}}
						type="number"
						placeholder="Por Nit"
						className="form-control"
					/>
				</div>
				<div className="col-md-2">
					<select
						value={estado}
						onChange={(e) => {
							setEstado(e.target.value);
						}}
						className="form-control"
					>
						<option value="">Filtro por Estado</option>
						<option value="activo">Activo</option>
						<option value="inactivo">Inactivo</option>
						<option value="creado">Creado</option>
					</select>
				</div>
				<div className="col-md-2">
					<input
						value={ncompany}
						onChange={(e) => {
							setNcompany(e.target.value);
						}}
						type="text"
						placeholder="Por Nombre de Empresa"
						className="form-control"
					/>
				</div>
				<div className="col-md-2">
					<input
						value={csector}
						onChange={(e) => {
							setCsector(e.target.value);
						}}
						type="text"
						placeholder="Por Sector"
						className="form-control"
					/>
				</div>
				<div className="col-md-2">
					<input
						value={ccountry}
						onChange={(e) => {
							setCcountry(e.target.value);
						}}
						type="text"
						placeholder="Por Pais"
						className="form-control"
					/>
				</div>
				<div className="col-md-2">
					<input
						value={ccity}
						onChange={(e) => {
							setCcity(e.target.value);
						}}
						type="text"
						placeholder="Ciudad"
						className="form-control"
					/>
				</div>

				<div className="col-md-2">
					<label htmlFor="fechaInicio" className="form-label">
						Desde Fecha de Creación:
					</label>
					<input
						type="date"
						id="fechaInicio"
						name="fechaInicio"
						value={fechaInicio}
						onChange={(e) => setFechaInicio(e.target.value)}
					/>
				</div>

				<div className="col-md-2">
					<label htmlFor="fechaFin" className="form-label">
						Hasta Fecha de Creación:
					</label>
					<input
						type="date"
						id="fechaFin"
						name="fechaFin"
						value={fechaFin}
						onChange={(e) => setFechaFin(e.target.value)}
					/>
				</div>

				<div className="col-md-7 mt-5">
					<button className="filter__btn" onClick={buscar}>
						Buscar
					</button>
					<button className="filter__btn__second" onClick={limpiar}>
						Limpiar
					</button>
				</div>
				</div>
		</div>
			<table className="table table-striped table-bordered table-hover mt-5 text-center">
				<thead className="thead-dark">
					<tr>
						<th>Razon Social</th>
						<th>SECTOR EMPRESARIAL</th>
						<th>Pais</th>
						<th>Ciudad</th>
						<th>Estado</th>
					</tr>
				</thead>
				<tbody>
					{Array.isArray(results) &&
						results.map((company, index) => (
							<tr
								key={company.business_name}
								className={index % 2 === 0 ? "table-light" : ""} // Aplica clase para filas pares
							>
								<td>{company.business_name}</td>
								<td>{company.razon_social}</td>
								<td>{company.country_name}</td>
								<td>{company.city_name}</td>

								<td>
									{company.status === "ACTIVE"
										? "Activo"
										: company.status === "INACTIVE"
										? "Inactivo"
										: company.status === "CREATED"
										? "Creado"
										: "Estado Desconocido"}
								</td>
							</tr>
						))}
				</tbody>
			</table>
			<div className="pager">
			<button className="last__page" onClick={() => paginacion(0)}>Anterior</button>
			<span>Página {pageNumber + 1}</span>
			<button className="next__page" onClick={() => paginacion(1)}>Siguiente</button>
			</div>
			</div>

		)}

	
		</>
	);
}
