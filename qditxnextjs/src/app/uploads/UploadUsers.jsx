"use client";
import { useState } from "react";

export default function UploadUsers() {
	const [file, setFile] = useState(null);

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		setFile(selectedFile);
	};

	const handleUpload = async () => {
		if (!file) {
			console.error("No se ha seleccionado ningún archivo.");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await fetch("http://localhost:8080/uploadUsers", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const result = await response.json();
				console.log("Respuesta del servidor:", result);
			} else {
				console.error("Error en la solicitud:", response.statusText);
			}
		} catch (error) {
			console.error("Error al procesar la solicitud:", error);
		}
	};

	return (
		<div>
			<input type="file" onChange={handleFileChange} />
			<button onClick={handleUpload}>Subir Archivo</button>
		</div>
	);
}
