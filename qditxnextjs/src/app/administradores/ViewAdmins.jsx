"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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
	const getAdmins = async () => {
		try {
			const traer = await fetch("http://localhost:8080/users");
			const jsonData = await traer.json();
			setUsers(jsonData);
			setResults(jsonData);
		} catch (err) {
			console.error(err.message);
		}
	};

	useEffect(() => {
		getAdmins();
	}, []);

	function buscar() {
		let filteredUsers = users;

		if (cc) {
			filteredUsers = filteredUsers.filter(
				(dato) => dato.identification === cc
			);
		}

		if (nuser) {
			filteredUsers = filteredUsers.filter(
				(dato) => dato.user_name && dato.user_name.includes(nuser)
			);
		}

		if (names) {
			filteredUsers = filteredUsers.filter((dato) => dato.name === names);
		}
		if (last_names) {
			filteredUsers = filteredUsers.filter(
				(dato) => dato.last_name === last_names
			);
		}
		if (numero) {
			filteredUsers = filteredUsers.filter((dato) => dato.movil === numero);
		}
		if (estado) {
			// Aquí debes usar '==' o '===' para comparar, no '='
			if (estado === "activo") {
				filteredUsers = filteredUsers.filter(
					(dato) => dato.status === "ACTIVE"
				);
			} else {
				filteredUsers = filteredUsers.filter(
					(dato) => dato.status === "INACTIVE"
				);
			}
		}
		setResults(filteredUsers);
	}

	function limpiar() {
		setNuser("");
		setCc("");
		setLast_names("");
		setNames("");
		setNumero("");
		setEstado("");
		setResults(users);
	}

	return (
		<>
			<h1 className="text-dark center text-center">Lista de Administradores</h1>
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
						<button className="btn btn-primary mr-2" onClick={buscar}>
							Buscar
						</button>
						<button className="btn btn-secondary" onClick={limpiar}>
							Limpiar
						</button>
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
								<td>{user.status === "ACTIVE" ? "Activo" : "Inactivo"}</td>
							</tr>
						))}
				</tbody>
			</table>
		</>
	);
}

export default ViewAdmins;
