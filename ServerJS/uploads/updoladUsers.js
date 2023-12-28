const express = require("express");
const routerUploadUsers = express.Router();
const conexion = require("../Conexion");
const { verifyToken } = require("../AuthMiddleware");
const multer = require("multer");
const xlsx = require("xlsx");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

routerUploadUsers.post(
	"/",

	upload.single("file"), // Middleware de multer para manejar el archivo
	async (req, res) => {
		try {
			// Conectar a la base de datos

			const fileBuffer = req.file.buffer;
			const workbook = xlsx.read(fileBuffer, { type: "buffer" });

			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];

			// Convertir el contenido del archivo a un array de objetos
			const data = xlsx.utils.sheet_to_json(worksheet, {
				header: 1,
				raw: false,
			});

			console.log("Sheet Name: ", sheetName);
			console.log("Worksheet: ", worksheet);
			console.log("Data: ", data);

			// Insertar datos en la base de datos
			data.slice(1).forEach(async (row) => {
				const nameValue = row[0];
				console.log("Name Value ", nameValue); // Accede al primer elemento del array
				const sql = "INSERT INTO t (name) VALUES (?)";
				const values = [nameValue];
				console.log("Values", values);

				try {
					const result = await conexion.query(sql, values);
					console.log(`Fila insertada con ID: ${result.insertId}`);
				} catch (error) {
					console.error("Error al insertar fila:", error);
				}
			});

			// Desconectar de la base de datos después de procesar todos los datos

			res.json({ message: "Datos insertados exitosamente" });
		} catch (error) {
			console.error("Error en la carga de archivos:", error);

			// Desconectar de la base de datos en caso de error
			await conexion.end();

			res.status(500).json({ error: "Internal Server Error" });
		}
	}
);

module.exports = routerUploadUsers;
