// RouterCompany.js
const express = require("express");
const RoutersCompany = express.Router();
const conexion = require("../Conexion");
const { verifyToken } = require("../AuthMiddleware");

RoutersCompany.get(
	"/",
	(req, res, next) => {
		// Asigna el token a la variable Gtoken
		req.headers["authorization"] = Gtoken;

		// Llama al middleware verifyToken
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

module.exports = RoutersCompany;
