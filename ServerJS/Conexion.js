let mysql = require("mysql");

let conexion = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: "1234",
	database: "tenant-1",
	port: "3308",
});

conexion.connect(function (err) {
	if (err) {
		throw err;
	} else {
		console.log("Conexión exitosa");
	}
});

module.exports = conexion;
