'use client'
import React, { useState, useEffect, useRef } from "react";
import './ViewPostulants.modules.css'
import "bootstrap/dist/css/bootstrap.min.css";



function ViewPostulants() {


    const [results, setResults] = useState([]);

    const isFirstRender = useRef(true);

    
    useEffect(() => {
		// Evita que se ejecute durante la renderización inicial "indefinida"
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		getPostulants();
	}, []);

    const getPostulants = async () => {
		try {
			console.log();

			// Construye la URL con los parámetros de filtro si están presentes
			let url = `http://localhost:8080/postulants`;

			const response = await fetch(url);
			const jsonData = await response.json();


			setResults(jsonData.data);
            console.log(results);
		} catch (err) {
			console.error(err.message);
		}
	};

  return (

    <div>

            <div className="Header">
				<h1 className="text-light center text-center">Lista de postulantes</h1>
				
              
				
			</div>
			<table className="table table-striped table-bordered table-hover mt-5 text-center">
				<thead className="thead-dark">
					<tr>
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
								<td>{user.name}</td>
								<td>{user.last_name}</td>
								<td>{user.academic_user}</td>
                                <td>{user.program_enrolled=== null ? "Sin programa" : user.program_enrolled}</td>
								<td>{user.program_graduate=== null ? "Sin programa" : user.program_graduate}</td>	
								<td>{user.date_update=== null ? "-" : user.date_update}</td>
                                <td>{user.filling_percentage}</td>
								<td>{user.status === "ACTIVE" ? "Activo" : "Inactivo"}</td>
							</tr>
						))}
				</tbody>
			</table>

    </div>

  )
}

export default ViewPostulants