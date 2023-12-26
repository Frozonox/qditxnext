const express = require("express");
const app = express();
const cors = require("cors");
const conexion = require("./Conexion");
const port = 8080;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("./AuthMiddleware");
const RouterUsers = require("./Rutas/UsersController");
const RoutersCompany = require("./Rutas/CompanysController");
const RouterOpportunitys = require("./Rutas/OpportunitysController");

app.use(cors());
app.use(express.json());

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
							expiresIn: "1h",
						}
					);
					//console.log(token);
					res.setHeader("Authorization", token);
					Gtoken = token;
					res.status(200).json({ message: "Login exitoso" });
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

// Set up our server so it will listen on the port
app.listen(port, function (error) {
	// Checking any error occur while listening on port
	if (error) {
		console.log("Something went wrong", error);
	}
	// Else sent message of listening
	else {
		console.log("Server is listening on port" + port);
	}
});
