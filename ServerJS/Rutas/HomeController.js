const express = require("express");
const RouterHome = express.Router();
const conexion = require("../Conexion");
const { verifyToken } = require("../AuthMiddleware");

RouterHome.get("/", (req,res,next) =>
{
    res.send("Bienvenido");
});

module.exports = RouterHome;