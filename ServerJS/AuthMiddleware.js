const jwt = require("jsonwebtoken");

exports.cookieJwtAuth = (req, res, token, next) => {
	
	try {
		if (!token) {
			return res.status(401).json({ error: "Token no proporcionado" });
		}
		jwt.verify(token, "secreto_del_token", (err, decoded) => {
			if (err) {
				return res.status(403).json({ error: "Token inválido" });
			} else {
				// Almacenar información del usuario en el objeto de solicitud
				console.log(token);
				const user = jwt.verify(token, "secreto_del_token");
				req.user = user;
				next();
			}
		});
	} catch (err) {
		console.log(token);

		console.error("Error al verificar el token:", err);
		res.clearCookie("token");
		// return res.redirect("/home");
	}
};
