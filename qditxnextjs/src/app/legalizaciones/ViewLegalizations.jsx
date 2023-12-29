"use client";
import React, { useState, useEffect, useRef } from "react";
import "./ViewLegalizations.modules.css";
import "bootstrap/dist/css/bootstrap.min.css";
import LoadScreen from "../LoadScreen.jsx";

function ViewLegalizations() {

    const [legalization, setLegalizations] = useState([]);

    const [currentFilters, setCurrentFilters] = useState({});

    const [results, setResults] = useState([]);

	const isFirstRender = useRef(true);
	const [pageNumber, setPageNumber] = useState(0);

	const [isLoading, setLoad] = useState(true);

            const [names, setNames] = useState("");
			const [last_names, setLast_names] = useState("");
			const[code, setCode]= useState("");
			const [program, setProgram]= useState("");
			const[company, setCompany] = useState("");
			const [period, setPeriod] = useState("");



	useEffect(() => {
		// Evita que se ejecute durante la renderización inicial "indefinida"
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		getLegalizations(pageNumber);
	}, [pageNumber]);

	const getLegalizations = async (page, filters) => {
		try {
			console.log();

			// Construye la URL con los parámetros de filtro si están presentes
			let url = `http://localhost:8080/practicesLegalized?page=${page}`;

            if (filters) {
				const {code, names, last_names, program, company, period} = filters;

				if (code) {
					url += `&code=${code}`;
				}

                if(names)
                {
                    url += `&names=${names}`;
                }
                if(last_names)
                {
                    url += `&last_names=${last_names}`;
                }
                if(program)
                {
                    url += `&program=${program}`;
                }
                if(company)
                {
                    url += `&company=${company}`;
                }
                if(period)
                {
                    url += `&period=${period}`;
                }
            }
			
			setLoad(true);
			const response = await fetch(url);
			const jsonData = await response.json();
			setLoad(false);
			setResults(jsonData.data);
			setLegalizations(jsonData.data);

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
		getLegalizations(pageNumber);
	}

	 function buscar() {
	 	getLegalizations(0, { code, names, last_names, company, period, program });
	 }
    function limpiar() {
	 	const initialFilters = {
	 		code: "",
	 		names: "",
	 		period: "",
	 		last_names: "",
            program:"",
            company:"",
	 	};
	 	setCurrentFilters(initialFilters);
	 	getLegalizations(0, initialFilters);
	 	
        setNames("");
        setCode("");
        setCompany("");
        setPeriod("");
        setProgram("");
        setLast_names("");

	 	setResults(legalization);
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

    function statusChoser(status)
    {
        switch (status) {
            case "POSTULANT_REVIEW":

            return "creado"
                
            case "CPT_APPROVAL":

            return  "Aprobado"

            case "CTP_CANCEL":

            return "Anulado"

            case "CTP_REVIEW":

            return "En revisión por practicas progresa"

            case "FINISHED":

            return "Finalizado"

            case "CTP_REJECTED":

            return "Rechazada por prácticas progresa"

            default: 
                break;
        }
    }

    function optionChanger(status)
    {
        if(status == "CTP_CANCEL")
        {
            return <button className="next__page">Legalizaciones</button>
        }
        else{
            return <select>

                <option /*value=""*/>legalization</option>
				<option >plan de practica</option>
				<option>seguimiento</option>
            </select>
        }
        
    }

	return (
		<>
		{isLoading ? (
			<LoadScreen />
		):(<div>

		
			<div className="Header">
				<h1 className="text-light center text-center">Lista de legalizaciones</h1>
				 <div className="row">
					<div className="col-md-2">
						<input
							value={code}
							onChange={(e) => {
								setCode(e.target.value);
							}}
							type="number"
							placeholder="Por Codigo"
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
							placeholder="Por apellidos"
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
							placeholder="Por Program"
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
                    <div className="col-md-2">
						<input
							value={company}
							onChange={(e) => {
								setCompany(e.target.value);
							}}
							type="text"
							placeholder="Por organización"
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

			<table className="table table-striped table-bordered table-hover mt-5 text-center small">
				<thead className="thead-dark">
					<tr>
						<th>Identificación</th>
						<th>Nombres</th>
						<th>Apellidos</th>
						<th>Programa/Periodo</th>
						<th>Organización</th>
						<th>Monitor/Docente</th>
						<th>Fecha inicio</th>
						<th>Fecha finalización</th>
						<th>Estado</th>
                        <th>Opciones</th>
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
								<td>{user.programPeriod}</td>
                                <td>{user.business_name}</td>
                                <td>{user.monitor===null?"-":user.monitor}</td>
								<td>{formatDate(user.date_start_practice)}</td>
                                <td>{formatDate(user.date_end_practice)}</td>
								<td>
                                    {statusChoser(user.status_apl)}	
                                </td>
                                <td>
                                {optionChanger(user.status_apl)}
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
		</div>)}
		
		</>	
	);
}

export default ViewLegalizations;
