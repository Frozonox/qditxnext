"use client";
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import OpportunityCard from "./OpportunityCard";
import './ViewOportunities.modules.css'
import LoadScreen from "../LoadScreen.jsx";


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

	const [color, setColor] = useState("");

	const [isLoading,setLoad]= useState(true);

	const isFirstRender = useRef(true);
    
	const [pageNumber, setPageNumber] = useState(0);

	const getOportunities = async (page) => {
		try {
			setLoad(true);
			const traer = await fetch(`http://localhost:8080/opportunitys?page=${page}`);
			const jsonData = await traer.json();
			setResults(jsonData);
			setLoad(false);
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
		getOportunities(pageNumber);
	};

	function colorChoose(type) {
		switch (type) {
			case "JOB_OFFER": 
			return "rgb(33, 255, 88)"

			case "ACADEMIC_PRACTICE":
			
			return "rgb(33, 137, 255)"

			case "STUDY_WORKING": 

			return "rgb(255, 140, 220)"
		
			default:
				break;
		}
		
	}
	

	useEffect(() => {
		// Evita que se ejecute durante la renderización inicial "indefinida"
		if (isFirstRender.current) {
			isFirstRender.current = false;
			console.log("first")
			return;
		}

		console.log("asjdajsja")

		getOportunities(pageNumber);
	},[pageNumber]);

	return (
		<>
			{isLoading ? ( <LoadScreen />):(
				<div>
				<h1 className="text-dark center text-center">Lista de Oportunidades</h1>
				<div className="grid-container">
				{results.map((e, index) => (
					
					<div className="grid-item">           
					<OpportunityCard title={e.job_title} company={e.trade_name} payment={e.salary_range_min} area={e.name_program} 
				
				type={e.opportunity_type === "JOB_OFFER"
				? "Oferta Laboral" 
				: e.opportunity_type === "ACADEMIC_PRACTICE"
				? "Práctica"
				 :"Estudie trabajando" 
				 }
	
				 status={e.status}
					 
				color={colorChoose(e.opportunity_type)}/> 	
				
					</div>
	
	
	
				))}
				</div>
	
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

export default ViewOportunities