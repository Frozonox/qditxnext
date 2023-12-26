const express = require("express");
const RouterOpportunitys = express.Router();
const conexion = require("../Conexion");
const { verifyToken } = require("../AuthMiddleware");

RouterOpportunitys.get(
	"/",
	(req, res, next) => {
		// Asigna el token a la variable Gtoken
		req.headers["authorization"] = Gtoken;

		// Llama al middleware verifyToken
		verifyToken(req, res, next);
	},
	async (req, res) => {
		try {
			let { page = 0 } = req.query;

			const pageSize = 25; // Tamaño de la página

			// Calcular los límites del rango
			const start = page * pageSize + 1;
			const end = (page + 1) * pageSize;

			let opportunityQuery = `
    SELECT
        o.id,
        c.trade_name,
        o.job_title,
        GROUP_CONCAT(DISTINCT pm.name ORDER BY pm.name ASC) AS name_program,
        rs.value AS sector,
        ibs.value AS business_sector,
        CONCAT(ic.value, '-', ic.description) AS ciiu,
        DATE_FORMAT(CONVERT_TZ(o.date_creation, '+00:00', '+00:00'), '%d/%m/%Y') AS date_creation,
        o.job_title,
        IFNULL(iy.value, 'NO APLICA') AS years_experience,
        COALESCE(
            CASE o.opportunity_type
                WHEN 'JOB_OFFER' THEN CAST(jo.salary_range_min AS CHAR(45))
                WHEN 'ACADEMIC_PRACTICE' THEN CAST(ap.salary_range_min AS CHAR(45))
                ELSE 'N/A'
            END, 'N/A'
        ) AS salary_range_min,
        COALESCE(
            CASE o.opportunity_type
                WHEN 'JOB_OFFER' THEN CAST(jo.salary_range_max AS CHAR(45))
                WHEN 'ACADEMIC_PRACTICE' THEN CAST(ap.salary_range_max AS CHAR(45))
                ELSE 'N/A'
            END, 'N/A'
        ) AS salary_range_max,
        o.opportunity_type,
        COALESCE(GROUP_CONCAT(DISTINCT CONCAT(u.name, ' ', u.last_name) SEPARATOR ','), so.contracted) AS postulant,
        COALESCE(so.reason, so.why_no_contracted) AS why_no_contracted
    FROM
        opportunity o
        LEFT JOIN opportunity_programs opg ON o.id = opg.opportunity_id
        LEFT JOIN program pm ON pm.id = opg.program_id
        LEFT JOIN change_status_opportunity so ON o.id = so.opportunity_id AND so.status_after = 'CLOSED'
        LEFT JOIN company c ON o.company_id = c.id
        LEFT JOIN opportunity_programs op ON o.id = op.opportunity_id
        LEFT JOIN job_offer jo ON o.id = jo.job_offer_id
        LEFT JOIN academic_practice ap ON o.id = ap.academic_practice_id
        LEFT JOIN item iy ON iy.id = jo.years_experience
        LEFT JOIN item rs ON rs.id = c.sector
        LEFT JOIN item ibs ON ibs.id = c.business_sector
        LEFT JOIN item ic ON ic.value = c.ciiu_code AND ic.list_id = 'L_CIIU'
        LEFT JOIN opportunity_application oa ON so.opportunity_id = oa.opportunity_id AND oa.contracted = 1
        LEFT JOIN user u ON oa.postulant_id = u.id AND u.status <> 'REMOVED'
    WHERE o.id BETWEEN ${start} AND ${end}
    GROUP BY o.id, c.trade_name, sector, business_sector, ciiu, date_creation, o.job_title,
        years_experience, salary_range_min, salary_range_max, o.opportunity_type, so.contracted, so.reason, why_no_contracted
`;

			const queryParams = { page };
			conexion.query(opportunityQuery, queryParams, (error, results) => {
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

module.exports = RouterOpportunitys;
