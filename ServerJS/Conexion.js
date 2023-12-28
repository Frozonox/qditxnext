let mysql = require("mysql");
require("dotenv").config();

let conexion = mysql.createConnection({
	host: process.env.BD_HOST,
	user: process.env.BD_USER,
	password: process.env.BD_PASS,
	database: process.env.BD_NAME_STRING,
	port: process.env.BD_PORT,
});

conexion.connect(function (err) {
	if (err) {
		throw err;
	} else {
		console.log("Conexión exitosa");
	}
});

module.exports = conexion;
