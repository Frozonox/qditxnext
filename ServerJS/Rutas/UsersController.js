const express = require("express");
const RouterUsers = express.Router();
const conexion = require("../Conexion");
const { cookieJwtAuth } = require("../AuthMiddleware");
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./data");


RouterUsers.get(
	"/",
	(req, res, next) => {
		// Obtener el token desde localStorage
		const token = localStorage.getItem("token");

		// Llamar al middleware con el token
		cookieJwtAuth(req, res, token, next);
	},
	async (req, res) => {
		try {
			// console.log(req.user);
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
module.exports = RouterUsers;
