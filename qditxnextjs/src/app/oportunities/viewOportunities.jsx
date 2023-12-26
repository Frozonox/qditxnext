"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import OpportunityCard from "./OpportunityCard";
// import { BiSearch, BiRefresh } from "react-bootstrap-icons";

function ViewOportunities() {
	const [users, setUsers] = useState([]);
	const [title, setTitle] = useState("");
	const [results, setResults] = useState([]);
	const [company, setCompany] = useState("");
	const [payment, setPayment] = useState("");
	const [area, setArea] = useState("");
	const [status, setStatus] = useState("");
	const [estado, setEstado] = useState("");
    
	const getOportunities = async () => {
		try {
			const traer = await fetch("http://localhost:8080/users");
			const jsonData = await traer.json();
			setUsers(jsonData);
			setResults(jsonData);
		} catch (err) {
			console.error(err.message);
		}
	};

	return (
		<>
			<h1 className="text-dark center text-center">Lista de Oportunidades</h1>

            {results.map((e, index) => (
            <div>
               
                 {/* <OpportunityCard title={e.title} company={e.company} payment={e.payment} area={e.area} status={e.status}/> */}
                
            </div>
            ))}
            
				 <OpportunityCard title="dasdda" subtitle="subtitle" company="DAS" payment="AJSD" area="FEJ" status="JDA" type="Laboral"/>
		</>
	);
}

export default ViewOportunities