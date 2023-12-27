"use client";
import React, { useState, useEffect, useRef } from "react";
import "./ViewPostulants.modules.css";
import "bootstrap/dist/css/bootstrap.min.css";

function ViewPostulants() {
	const [results, setResults] = useState([]);
	const [postulants, setPostulants] = useState([]);
	const [currentFilters, setCurrentFilters] = useState({});
	const [cc, setCc] = useState("");
	const [nuser, setNuser] = useState("");
	const [names, setNames] = useState("");
	const [last_names, setLast_names] = useState("");
	const isFirstRender = useRef(true);
	const [pageNumber, setPageNumber] = useState(0);

	useEffect(() => {
		// Evita que se ejecute durante la renderización inicial "indefinida"
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		getPostulants(pageNumber);
	}, [pageNumber]);

	const getPostulants = async (page, filters) => {
		try {
			console.log();

			// Construye la URL con los parámetros de filtro si están presentes
			let url = `http://localhost:8080/postulants?page=${page}`;
			if (filters) {
				const { cc, nuser, names, last_names, numero, estado } = filters;

				if (cc) {
					url += `&code=${cc}`;
				}

				if (nuser) {
					url += `&name_users=${nuser}`;
				}

				if (names) {
					url += `&names=${names}`;
				}

				if (last_names) {
					url += `&last_names=${last_names}`;
				}
			}
			const response = await fetch(url);
			const jsonData = await response.json();

			setResults(jsonData.data);
			setPostulants(jsonData.data);
			// console.log(results);
		} catch (err) {
			console.error(err.message);
		}
	};
	function paginacion(page) {
		if (page === 1) {
			setPageNumber(pageNumber + 1);
		} else if (page === 0 && pageNumber > 0) {
			setPageNumber(pageNumber - 1);
		}
		getPostulants(pageNumber);
	}

	function buscar() {
		getPostulants(0, { cc, nuser, names, last_names });
	}

	function limpiar() {
		const initialFilters = {
			cc: "",
			nuser: "",
			names: "",
			last_names: "",
		};
		setCurrentFilters(initialFilters);
		getPostulants(0, initialFilters);
		setNuser("");
		setCc("");
		setLast_names("");
		setNames("");

		setResults(postulants);
		setPageNumber(0);
	}

	const formatDate = (dateString) => {
		if (!dateString) {
			return "-";
		}

		const date = new Date(dateString);
		const options = { day: "2-digit", month: "2-digit", year: "numeric" };

		return date.toLocaleDateString("es-ES", options);
	};

	return (
		<div>
			<div className="Header">
				<h1 className="text-light center text-center">Lista de postulantes</h1>
				<div className="row">
					<div className="col-md-2">
						<input
							value={cc}
							onChange={(e) => {
								setCc(e.target.value);
							}}
							type="number"
							placeholder="Por Codigo"
							className="form-control"
						/>
					</div>
					<div className="col-md-2">
						<input
							value={nuser}
							onChange={(e) => {
								setNuser(e.target.value);
							}}
							type="text"
							placeholder="Por Nombre de Usuario"
							className="form-control"
						/>
					</div>
					<div className="col-md-2">
						<input
							value={names}
							onChange={(e) => {
								setNames(e.target.value);
							}}
							type="text"
							placeholder="Por Nombre"
							className="form-control"
						/>
					</div>
					<div className="col-md-2">
						<input
							value={last_names}
							onChange={(e) => {
								setLast_names(e.target.value);
							}}
							type="text"
							placeholder="Por Apellidos"
							className="form-control"
						/>
					</div>

					<div className="row mt-2">
						<div className="col-md-6">
							<button className="filter__btn" onClick={buscar}>
								Buscar
							</button>
							<button className="filter__btn__second" onClick={limpiar}>
								Limpiar
							</button>
						</div>
					</div>
				</div>
			</div>

			<table className="table table-striped table-bordered table-hover mt-5 text-center">
				<thead className="thead-dark">
					<tr>
						<th>Identificación</th>
						<th>Nombres</th>
						<th>Apellidos</th>
						<th>Usuario</th>
						<th>En curso</th>
						<th>Finalizado</th>
						<th>Actualizado</th>
						<th>Completitud</th>
						<th>Estado</th>
					</tr>
				</thead>
				<tbody>
					{Array.isArray(results) &&
						results.map((user, index) => (
							<tr
								key={user.id}
								className={index % 2 === 0 ? "table-light" : ""} // Aplica clase para filas pares
							>
								<td>{user.identification}</td>
								<td>{user.name}</td>
								<td>{user.last_name}</td>
								<td>{user.academic_user}</td>
								<td>
									{user.program_enrolled === null
										? "Sin programa"
										: user.program_enrolled}
								</td>
								<td>
									{user.program_graduate === null
										? "Sin programa"
										: user.program_graduate}
								</td>
								<td>{formatDate(user.date_update)}</td>
								<td>{user.filling_percentage}%	</td>
								<td>{user.status === "ACTIVE" ? "Activo" : "Inactivo"}</td>
							</tr>
						))}
				</tbody>
			</table>
			<div className="pager">
				<button className="last__page" onClick={() => paginacion(0)}>
					Anterior
				</button>
				<span>Página {pageNumber + 1}</span>
				<button className="next__page" onClick={() => paginacion(1)}>
					Siguiente
				</button>
			</div>
		</div>
	);
}

export default ViewPostulants;
