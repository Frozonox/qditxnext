const express = require("express");
const RouterPostulants = express.Router();
const conexion = require("../Conexion");
const { verifyToken } = require("../AuthMiddleware");

RouterPostulants.get(
	"/",
	(req, res, next) => {
		// Asigna el token a la variable Gtoken
		req.headers["authorization"] = Gtoken;

		// Llama al middleware verifyToken
		verifyToken(req, res, next);
	},
	async (req, res) => {
		try {
			const { page = 0, names, last_names, code, user_name } = req.query;

			let offset = page * 25;
			let postulantsQuery = `
  SELECT  
    p.postulant_id,	
	u.identification,	
    u.name,
    u.last_name,
    pp.academic_user,
    pro_graduate.name AS program_graduate,
    pro_enrolled.name AS program_enrolled,
    u.date_update,
    p.filling_percentage,
    u.status
  FROM
    postulant p
  LEFT JOIN
    user u ON u.id = p.postulant_id
  LEFT JOIN
    postulant_profile pp ON pp.postulant_id = p.postulant_id
  LEFT JOIN
    profile_graduate_program pgp ON pp.id = pgp.profile_id
  LEFT JOIN
    program pro_graduate ON pgp.program_id = pro_graduate.id
  LEFT JOIN
    profile_enrolled_program pep ON pp.id = pep.profile_id
  LEFT JOIN
    program pro_enrolled ON pep.program_id = pro_enrolled.id
`;

			let whereClauses = [];

			if (code) {
				whereClauses.push(`u.identification = '${code}'`);
			}
			if (names) {
				whereClauses.push(`u.name LIKE '%${names}%'`);
			}

			if (last_names) {
				whereClauses.push(`u.last_name = '${last_names}'`);
			}

			if (user_name) {
				whereClauses.push(`u.user_name LIKE '%${user_name}%'`);
			}

			if (whereClauses.length > 0) {
				postulantsQuery += ` WHERE ${whereClauses.join(" AND ")}`;
			}

			postulantsQuery += `
    LIMIT 15
    OFFSET ${offset}`;

			// Consulta para obtener el total de datos
			const totalQuery = `
        SELECT COUNT(p.postulant_id) AS total_postulants,
            COUNT(p.postulant_id)/25 AS total_pages
        FROM postulant p
        LEFT JOIN user u ON u.id = p.postulant_id
        LEFT JOIN postulant_profile pp ON pp.postulant_id = p.postulant_id
        LEFT JOIN profile_graduate_program pgp ON pp.id = pgp.profile_id
        LEFT JOIN program pro_graduate ON pgp.program_id = pro_graduate.id
        LEFT JOIN profile_enrolled_program pep ON pp.id = pep.profile_id
        LEFT JOIN program pro_enrolled ON pep.program_id = pro_enrolled.id
      `;

			const queryParams = [
				page,
				code,
				`%${names}%`,
				last_names,
				`%${user_name}%`,
			];
			const [results, totalResult] = await Promise.all([
				// Ejecuta ambas consultas de manera concurrente
				new Promise((resolve, reject) => {
					conexion.query(postulantsQuery, queryParams, (error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results);
						}
					});
				}),
				new Promise((resolve, reject) => {
					conexion.query(totalQuery, (error, totalResult) => {
						if (error) {
							reject(error);
						} else {
							resolve(totalResult[0]); // Ajusta el acceso a la columna correcta
						}
					});
				}),
			]);

			// Combina los resultados y envía la respuesta al cliente
			const response = {
				data: results,
				total: totalResult,
			};

			res.status(200).json(response);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
);

module.exports = RouterPostulants;
