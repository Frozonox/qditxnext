const express = require("express");
const RouterPracticesLegalized = express.Router();
const conexion = require("../Conexion");
const { verifyToken } = require("../AuthMiddleware");

RouterPracticesLegalized.get(
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

			let legalizedQuery = `
            SELECT 
                apl.academic_practice_legalized_id, 
                u.identification, 
                u.name, 
                u.last_name, 
                apl.boss_apl,
                CONCAT(pg.name, '-', ap.period) AS programPeriod, 
                com.business_name,
                CONCAT(u_tutor.name, ' ', u_tutor.last_name) AS monitor, 
                apl.date_start_practice, 
                apl.date_end_practice, 
                apl.status_apl
            FROM 
                academic_practice_legalized apl
            LEFT JOIN 
                postulant p ON apl.postulant_apl = p.postulant_id
            LEFT JOIN 
                user u ON p.postulant_id = u.id
            LEFT JOIN 
                academic_period ap ON apl.academic_period_apl = ap.id
            LEFT JOIN 
                program pg ON apl.program_apl = pg.id
            LEFT JOIN
                company com ON apl.company_apl = com.id
            LEFT JOIN
                user u_tutor ON apl.user_tutor = u_tutor.id
            `;

			legalizedQuery += `ORDER BY 
                apl.date_end_practice DESC
            LIMIT 15
            OFFSET 0`;

			let totalQuery = `
            SELECT 
                COUNT(apl.academic_practice_legalized_id) total_legalized,
                CEIL(COUNT(apl.academic_practice_legalized_id) / 15) AS total_pages
            FROM
                academic_practice_legalized apl`;

			const queryParams = [page];

			const [practiceLegalizedResults, totalResult] = await Promise.all([
				// Ejecutar la consulta de prácticas
				new Promise((resolve, reject) => {
					conexion.query(legalizedQuery, queryParams, (error, results) => {
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
				data: practiceLegalizedResults,
				total: totalResult,
			};

			res.status(200).json(response);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
);

module.exports = RouterPracticesLegalized;
