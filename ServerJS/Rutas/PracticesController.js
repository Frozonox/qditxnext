const express = require("express");
const RouterPractices = express.Router();
const conexion = require("../Conexion");
const { verifyToken } = require("../AuthMiddleware");

RouterPractices.get(
	"/",
	(req, res, next) => {
		// Asigna el token a la variable Gtoken
		req.headers["authorization"] = Gtoken;

		// Llama al middleware verifyToken
		verifyToken(req, res, next);
	},
	async (req, res) => {
		try {
			const {
				page = 0,
				code,
				email,
				names,
				last_names,
				period,
				program,
				states,
				type_practice,
			} = req.query;

			let offset = page * 15;

			let practiceQuery = `
        SELECT 
          aps.id,
          u.user_name,
          u.identification,
          u.name AS name_student,
          u.last_name,
          p.name,
          ap.period,
          it.value As type_practice,
          sap.value,
          aps.date_update
        FROM 
          academic_practice_student aps
        LEFT JOIN 
          postulant ps ON aps.student_id = ps.postulant_id
        LEFT JOIN 
          program p ON aps.program_id = p.id
        LEFT JOIN 
          academic_period ap ON aps.period_id = ap.id
        LEFT JOIN 
          item it ON aps.practice_id = it.id
        LEFT JOIN 
          states_authorized_practice sap ON aps.status_id = sap.id
        LEFT JOIN 
          user u ON ps.postulant_id = u.id
      `;

			let whereClauses = [];

			if (code) {
				whereClauses.push(`u.identification = '${code}'`);
			}

			if (email) {
				whereClauses.push(`u.user_name LIKE '%${email}%'`);
			}

			if (names) {
				whereClauses.push(`u.name LIKE '%${names}%'`);
			}

			if (last_names) {
				whereClauses.push(`u.last_name = '${last_names}'`);
			}

			if (period) {
				whereClauses.push(`ap.period = '${period}'`);
			}

			if (program) {
				whereClauses.push(`p.name = '${program}'`);
			}
			if (states) {
				whereClauses.push(`sap.value = '${states}'`);
			}
			if (type_practice) {
				whereClauses.push(`it.value= '${type_practice}'`);
			}

			if (whereClauses.length > 0) {
				practiceQuery += ` WHERE ${whereClauses.join(" AND ")}`;
			}

			practiceQuery += `
        ORDER BY aps.date_update DESC
        LIMIT 15
        OFFSET ${offset}

      `;
			let totalQuery = `SELECT 
    count(aps.id) AS total_practices,
    count(aps.id)/15 AS totalpages

FROM  academic_practice_student aps;`;

			const queryParams = [
				page,
				code,
				`%${email}%`,
				`%${names}%`,
				last_names,
				period,
				program,
				states,
				type_practice,
			];

			const [practiceResults, totalResult] = await Promise.all([
				// Ejecutar la consulta de prácticas
				new Promise((resolve, reject) => {
					conexion.query(practiceQuery, queryParams, (error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results);
						}
					});
				}),

				// Ejecutar la consulta total
				new Promise((resolve, reject) => {
					conexion.query(totalQuery, (error, totalResult) => {
						if (error) {
							reject(error);
						} else {
							resolve(totalResult[0]);
						}
					});
				}),
			]);

			// Combina los resultados y envía la respuesta al cliente
			const response = {
				data: practiceResults,
				total: totalResult,
			};

			res.status(200).json(response);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
);

module.exports = RouterPractices;
