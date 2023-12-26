const express = require("express");
const app = express();
const cors = require("cors");
const conexion = require("./Conexion");
const port = 8080;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

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

let Gtoken;

let verifyToken = (req, res, next) => {
	let token = req.headers["authorization"];

	if (!token) {
		return res.status(401).json({ error: "Token no proporcionado" });
	}
	jwt.verify(token, "secreto_del_token", (err, decoded) => {
		if (err) {
			return res.status(403).json({ error: "Token inválido" });
		} else {
			// Almacenar información del usuario en el objeto de solicitud
			token = Gtoken;
			req.user = decoded;

			next();
		}
	});
};

app.get(
	"/users",
	(req, res, next) => {
		req.headers["authorization"] = Gtoken;

		verifyToken(req, res, next);
	},
	async (req, res) => {
		try {
			const {
				page = 0,
				cc,
				nuser,
				names,
				last_names,
				numero,
				estado,
			} = req.query;

			let offset = page * 25;

			let usuariosQuery = `
        SELECT
          us.id,
          us.name,
          us.last_name,
          us.user_name,
          us.identification,
          us.movil,
          us.status,
          GROUP_CONCAT(rl.name) AS roles
        FROM
          user us
          LEFT JOIN user_role ur ON us.id = ur.user_id
          LEFT JOIN role rl ON rl.id = ur.role_id
      `;

			let whereClauses = [];

			if (cc) {
				whereClauses.push(`us.identification = '${cc}'`);
			}

			if (nuser) {
				whereClauses.push(`us.user_name LIKE '%${nuser}%'`);
			}

			if (names) {
				whereClauses.push(`us.name = '${names}'`);
			}

			if (last_names) {
				whereClauses.push(`us.last_name = '${last_names}'`);
			}

			if (numero) {
				whereClauses.push(`us.movil = '${numero}'`);
			}

			if (estado) {
				whereClauses.push(
					`us.status = '${estado === "activo" ? "ACTIVE" : "INACTIVE"}'`
				);
			}

			if (whereClauses.length > 0) {
				usuariosQuery += ` WHERE ${whereClauses.join(" AND ")}`;
			}

			usuariosQuery += `
        GROUP BY
          us.id
        LIMIT 25
        OFFSET ${offset}
      `;

			// Execute the MySQL query
			//array con los valores de los parámetros
			const queryParams = [cc, `%${nuser}%`, names, last_names, numero, estado];

			conexion.query(usuariosQuery, queryParams, (error, results) => {
				if (error) {
					console.log(error);
					res.status(500).json({ error: "Internal Server Error" });
				} else {
					// Send the results back to the client
					res.status(200).json(results);
				}
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
);

app.get(
	"/companys",
	(req, res, next) => {
		req.headers["authorization"] = Gtoken;

		verifyToken(req, res, next);
	},
	async (req, res) => {
		try {
			let companyQuery = `
		SELECT c.id, c.business_name, i.value AS razon_social, cn.name AS country_name, ct.name AS city_name, c.status
		FROM company c
		LEFT JOIN item i ON c.business_sector = i.id
		LEFT JOIN country cn ON c.country = cn.id
		LEFT JOIN city ct ON c.city = ct.id
		
		`;
			const {
				page = 0,
				nit,
				ncompany,
				csector,
				ccountry,
				ccity,
				estado,
				fechaInicio,
				fechaFin,
			} = req.query;

			let offset = page * 25;

			let whereClauses = [];

			if (nit) {
				whereClauses.push(`c.identification_number = '${nit}'`);
			}

			if (ncompany) {
				whereClauses.push(`c.business_name LIKE '%${ncompany}%'`);
			}

			if (csector) {
				whereClauses.push(`i.value = '${csector}'`);
			}

			if (ccountry) {
				whereClauses.push(`cn.name = '${ccountry}'`);
			}

			if (ccity) {
				whereClauses.push(`ct.name = '${ccity}'`);
			}

			if (estado) {
				let estadoSQL;
				switch (estado.toLowerCase()) {
					case "activo":
						estadoSQL = "ACTIVE";
						break;
					case "creado":
						estadoSQL = "CREATED";
						break;
					case "inactivo":
						estadoSQL = "INACTIVE";
						break;
					default:
						// Manejar un estado no reconocido si es necesario.
						break;
				}

				if (estadoSQL) {
					whereClauses.push(`c.status = '${estadoSQL}'`);
				}
			}

			if (fechaInicio && fechaFin) {
				whereClauses.push(
					`c.date_creation BETWEEN '${fechaInicio}' AND '${fechaFin}'`
				);
			} else if (fechaInicio) {
				// Añadir condición de búsqueda si solo hay una fecha definida.
				whereClauses.push(`c.date_creation >= '${fechaInicio}'`);
			} else if (fechaFin) {
				// Añadir condición de búsqueda si solo hay una fecha definida.
				whereClauses.push(`c.date_creation <= '${fechaFin}'`);
			}

			if (whereClauses.length > 0) {
				companyQuery += ` WHERE ${whereClauses.join(" AND ")}`;
			}

			const queryParams = [
				page,
				nit,
				ncompany,
				csector,
				ccountry,
				ccity,
				estado,
				fechaInicio,
				fechaFin,
			];
			companyQuery += `
        		ORDER BY
				c.business_name
				LIMIT 15
				OFFSET ${offset}
      			`;
			console.log("SQL= " + companyQuery);
			console.log("Offset: ", offset);

			conexion.query(companyQuery, queryParams, (error, results) => {
				if (error) {
					console.log(error);
					res.status(500).json({ error: "Internal Server Error" });
				} else {
					// Send the results back to the client
					res.status(200).json(results);
				}
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
);

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
