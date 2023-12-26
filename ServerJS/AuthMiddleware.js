// AuthMiddleware.js
const jwt = require("jsonwebtoken");

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

module.exports = { verifyToken };
