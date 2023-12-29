"use client";
import React, { useState, useEffect, useRef } from "react";
import './ViewPracticas.modules.css'
import "bootstrap/dist/css/bootstrap.min.css";
import LoadScreen from "../LoadScreen";


// import { BiSearch, BiRefresh } from "react-bootstrap-icons";

function ViewPracticas() {

	const [users, setUsers] = useState([]);
    const [results, setResults] = useState([]);

	const [code, setCode] = useState("");
	const [email, setEmail] = useState("");
	const [names, setNames] = useState("");
	const [last_names, setLast_names] = useState("");
	const [period, setPeriod] = useState("");
	const [program, setProgram] = useState("");
    const [states, setStates] = useState("");
    const [type_practice, setType] = useState("");
    const [date_update, setUpdate] = useState("");

	const [isLoading, setLoad] = useState(true);

	const [pageNumber, setPageNumber] = useState(0);

	const isFirstRender = useRef(true);
	const [currentFilters, setCurrentFilters] = useState({});

	const getPractices = async (page, filters) => {
		try {
			console.log("Page: " + page);

			// Construye la URL con los parámetros de filtro si están presentes
			let url = `http://localhost:8080/practices?page=${page}`;

			if (filters) {
				const { code, email, names, last_names, period, program, states, type_practice, date_update} = filters;

				if (code) {
					url += `&code=${code}`;
				}

				if (email) {
					url += `&email=${email}`;
				}

				if (names) {
					url += `&names=${names}`;
				}

				if (last_names) {
					url += `&last_names=${last_names}`;
				}

				if (period) {
					url += `&period=${period}`;
				}

				if (program) {
					url += `&program=${program}`;
				}
                if (states) {
					url += `&states=${states}`;
				}
                if (type_practice) {
					url += `&type_practice=${type_practice}`;
				}

			}
			console.log("URL " + url);
			setLoad(true);
			const response = await fetch(url);
			const jsonData = await response.json();


			setUsers(jsonData.data);
			setResults(jsonData.data);
			setLoad(false);
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

		getPractices(pageNumber);
	}, [pageNumber]);

	function buscar() {
		getPractices(0, { code,email,names,last_names,period,program,states,type_practice,date_update});
	}

	function limpiar() {
		const initialFilters = {
			code: "",
			email: "",
			names: "",
			last_names: "",
			period: "",
			program: "",
            states: "",
            type_practice: "",

		};

        

		setCurrentFilters(initialFilters);
		getPractices(0, initialFilters);

		setEmail("");
		setCode("");
		setLast_names("");
		setNames("");
		setPeriod("");
		setProgram("");
        setStates("");		
        setType("");


        setResults(users);

		setPageNumber(0);
	}

	function paginacion(page) {
		if (page === 1) {
			setPageNumber(pageNumber + 1);
		} else if (page === 0 && pageNumber > 0) {
			setPageNumber(pageNumber - 1);
		}
		getPractices(pageNumber);
	}

    function dateFormater(fechaStr) {

        const fechaOriginal = new Date(fechaStr);
      
        const opcionesFormato = {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        };
      
        const formatoFecha = new Intl.DateTimeFormat('es-ES', opcionesFormato);
        const fechaFormateada = formatoFecha.format(fechaOriginal);
      
        return fechaFormateada;
      }

	return (
		<>
		{isLoading ? (
			<LoadScreen />
		):(
			<div>
<div className="Header">
				<h1 className="text-light center text-center">Lista de estudiantes aptos a prácticas</h1>
				<div className="row">
					<div className="col-md-2">
						<input
							value={code}
							onChange={(e) => {
								setCode(e.target.value);
							}}
							type="number"
							placeholder="Por Identificacion"
							className="form-control"
						/>
					</div>
					<div className="col-md-2">
						<input
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
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
							value={program}
							onChange={(e) => {
								setProgram(e.target.value);
							}}
							type="text"
							placeholder="Por programa"
							className="form-control"
						/>
					</div>
					<div className="col-md-2">
                    <input
							value={period}
							onChange={(e) => {
								setPeriod(e.target.value);
							}}
							type="text"
							placeholder="Por periodo"
							className="form-control"
						/>
					</div>
                    <div className="col-md-2 mt-2">
                    <input
							value={type_practice}
							onChange={(e) => {
								setType(e.target.value);
							}}
							type="text"
							placeholder="Por tipo de práctica"
							className="form-control"
						/>
					</div>
                    <div className="col-md-2 mt-2">
                    <input
							value={states}
							onChange={(e) => {
								setStates(e.target.value);
							}}
							type="text"
							placeholder="Por estado"
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
			<table className="table table-striped table-bordered table-hover mt-5 text-center small" >
				<thead className="thead-dark">
					<tr>
						<th className="col-3">Código</th>
                        <th className="col-3">Correo</th>
                        <th className="col-3">Nombres</th>
						<th className="col-3">Apellidos</th>
						<th className="col-3">Programa</th>
						<th className="col-3">Periodo</th>
						<th className="col-3">Tipo de practica</th>
						<th className="col-3">Estado</th>
                        <th className="col-3">Estado Final</th>
						<th className="col-3">Fecha de actualización</th>
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
								<td>{user.user_name}</td>
								<td>{user.name_student}</td>
								<td>{user.last_name}</td>
								<td>{user.name}</td>
								<td>{user.period}</td>
                                <td>{user.type_practice}</td>
                                <td>{user.value}</td>
                                <td>
                                <select>
                                    
                                <option selected={true} value="">Seleccione</option>
							    <option value="AUTORIZADO">Autorizado</option>
							    <option value="NO AUTORIZADO">No Autorizado</option>
                                <option value="EN REVISION">En Revisión</option>
                                    </select></td>
								<td>{dateFormater(user.date_update)}</td>
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

export default ViewPracticas;
