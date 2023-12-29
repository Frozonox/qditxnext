const jwt = require("jsonwebtoken");

exports.cookieJwtAuth = (req, res, next) => {
	const token = req.cookies.token;
	try {
		const user = jwt.verify(token, "secreto_del_token");
		req.user = user;
		next();
	} catch (err) {
		console.error("Error al verificar el token:", err);
		res.clearCookie("token");
		return res.redirect("/home");
	}
};
