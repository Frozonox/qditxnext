"use client";
import React, { useState, useEffect, useRef } from "react";
import "./ViewAdmins.modules.css";
import "bootstrap/dist/css/bootstrap.min.css";
import LoadScreen from "../LoadScreen";
import ToggleButton from "@/Toogle.btn/ToggleButton";

// import { BiSearch, BiRefresh } from "react-bootstrap-icons";

function ViewAdmins() {
	const [users, setUsers] = useState([]);
	const [cc, setCc] = useState("");
	const [results, setResults] = useState([]);
	const [nuser, setNuser] = useState("");
	const [names, setNames] = useState("");
	const [last_names, setLast_names] = useState("");
	const [numero, setNumero] = useState("");
	const [estado, setEstado] = useState("");

	const [isLoading, setLoad] = useState(true);

	const [pageNumber, setPageNumber] = useState(0);
	const isFirstRender = useRef(true);
	const [currentFilters, setCurrentFilters] = useState({});

	async function handleStatus(userState, userID){
		try {
		  const response = await fetch(`http://localhost:8080/users/stateUser/${userID}`, {
			method: 'PUT',
			headers: {
			  'Content-Type': 'application/json',

			},
			body: JSON.stringify({
			  stateUser: userState
			}),
		  });
	  
		  console.log(response);
	  
		  // Verificar el estado de la respuesta después de haberla impreso
		  console.log(response.status);
		} catch (error) {
		  console.log(error.message);
		}
	  }

	const getAdmins = async (page, filters) => {
		try {
			console.log("Page: " + page);

			// Construye la URL con los parámetros de filtro si están presentes
			let url = `http://localhost:8080/users?page=${page}`;

			if (filters) {
				const { cc, nuser, names, last_names, numero, estado } = filters;

				if (cc) {
					url += `&cc=${cc}`;
				}

				if (nuser) {
					url += `&nuser=${nuser}`;
				}

				if (names) {
					url += `&names=${names}`;
				}

				if (last_names) {
					url += `&last_names=${last_names}`;
				}

				if (numero) {
					url += `&numero=${numero}`;
				}

				if (estado) {
					url += `&estado=${estado}`;
				}
			}
			console.log("URL " + url);
			setLoad(true);
			const response = await fetch(url);
			const jsonData = await response.json();
			setLoad(false);

			setUsers(jsonData);
			setResults(jsonData);
		} catch (err) {
			console.error(err.message);
		}
	};

	useEffect(() => {
		// Evita que se ejecute durante la renderización inicial "indefinida"
		// if (isFirstRender.current) {
		// 	isFirstRender.current = false;
		// 	return;
		// }

		getAdmins(pageNumber);
	}, [!pageNumber]);

	function buscar() {
		getAdmins(0, { cc, nuser, names, last_names, numero, estado });
	}

	function limpiar() {
		const initialFilters = {
			cc: "",
			nuser: "",
			names: "",
			last_names: "",
			numero: "",
			estado: "",
		};

		setCurrentFilters(initialFilters);
		getAdmins(0, initialFilters);

		setNuser("");
		setCc("");
		setLast_names("");
		setNames("");
		setNumero("");
		setEstado("");

		setResults(users);

		setPageNumber(0);
	}

	function paginacion(page) {
		if (page === 1) {
			setPageNumber(pageNumber + 1);
		} else if (page === 0 && pageNumber > 0) {
			setPageNumber(pageNumber - 1);
		}
		getAdmins(pageNumber);
	}

	return (
		<>
			{/*Load Screen*/}

			 {isLoading ? (
				<LoadScreen />
			):( 

			<div>
				<div className="Header">
					<h1 className="text-light center text-center">
						Lista de Administradores
					</h1>
					<div className="row">
						<div className="col-md-2">
							<input
								value={cc}
								onChange={(e) => {
									setCc(e.target.value);
								}}
								type="number"
								placeholder="Por Identificacion"
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
						<div className="col-md-2">
							<input
								value={numero}
								onChange={(e) => {
									setNumero(e.target.value);
								}}
								type="text"
								placeholder="Por Numero Telefonico"
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
							</select>
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
							<th>Nombres</th>
							<th>Apellidos</th>
							<th>Identificacion</th>
							<th>Usuario</th>
							<th>Roles</th>
							<th>Movil</th>
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
									<td>{user.name}</td>
									<td>{user.last_name}</td>
									<td>{user.identification}</td>
									<td>{user.user_name}</td>
									<td>{user.roles}</td>
									<td>{user.movil}</td>
									<td>
										{/*falta implementa al hacer click ejecutar la consulta PUT*/}
									{user.status === "ACTIVE" ? "Activo" : "Inactivo"} 
										<ToggleButton  status={user.status === "ACTIVE" ? true : false}  />
										
									</td>
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
			 )};

			{/*RESULTADOS*/}
		</>
	);
}

export default ViewAdmins;
