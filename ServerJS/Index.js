const express = require("express");
const app = express();
const cors = require("cors");
const conexion = require("./Conexion");
const port = 8080;
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const RouterUsers = require("./Rutas/UsersController");
const RoutersCompany = require("./Rutas/CompanysController");
const RouterOpportunitys = require("./Rutas/OpportunitysController");
const RouterPostulants = require("./Rutas/PostulantCotroller");
const RouterPractices = require("./Rutas/PracticesController");
const RouterPracticesLegalized = require("./Rutas/PracticeLegalizedController");
const routerUploadUsers = require("./uploads/updoladUsers");
const RouterHome = require("./Rutas/HomeController");

app.use(cors());
app.use(cookieParser());
app.use(express.json());
let tock;
app.post("/login", (req, res) => {
	const { user_name, password } = req.body;

	const hashedPassword = crypto
		.createHash("sha256")
		.update(password)
		.digest("hex");

	try {
		const query =
			"SELECT * FROM user WHERE user_name = ? AND password_hash = ?";
		conexion.query(query, [user_name, hashedPassword], (error, results) => {
			if (error) {
				console.log(error);
				res.status(500).json({ error: "Internal Server Error" });
			} else {
				if (results.length > 0) {
					const token = jwt.sign(
						{ user_id: results[0].id, user_name },
						"secreto_del_token",
						{
							expiresIn: "10s",
						}
					);
					//console.log(token);
					tock = token;
					res.cookie("token", token);

					return res.redirect("/home");
				} else {
					res.status(401).json({ error: "Credenciales incorrectas" });
				}
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});
app.use("/users", RouterUsers);
app.use("/companys", RoutersCompany);
app.use("/opportunitys", RouterOpportunitys);
app.use("/postulants", RouterPostulants);
app.use("/practices", RouterPractices);
app.use("/practicesLegalized", RouterPracticesLegalized);
app.use("/uploadUsers", routerUploadUsers);
app.use("/home", RouterHome);

// Set up our server so it will listen on the port
const server = app.listen(port, function (error) {
	if (error) {
		console.log("Algo salió mal", error);
	} else {
		console.log("El servidor está escuchando en el puerto " + port);
	}
});

// Manejar el evento de salida del proceso

