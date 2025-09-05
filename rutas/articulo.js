const express = require("express");
const multer = require("multer");
const router = express.Router();
const ArticuloControlador = require("../controladores/articulo");

// Configuración de almacenamiento para multer
const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './imagenes/articulos');
    },
    filename: function(req, file, cb) {
        cb(null, "articulo_" + Date.now() + "_" + file.originalname);
    }
});

const subidas = multer({ storage: almacenamiento });

// Rutas de prueba
router.get("/ruta-de-prueba", ArticuloControlador.prueba);
router.get("/curso", ArticuloControlador.curso);

// CRUD de artículos
router.post("/crear", ArticuloControlador.crear);
router.get("/listar", ArticuloControlador.listar);
router.get("/articulo/:id", ArticuloControlador.uno);
router.delete("/borrar/:id", ArticuloControlador.borrar);
router.put("/actualizar/:id", ArticuloControlador.editar);

// Subida de imagen para un artículo
router.post("/subir-imagen/:id", subidas.single("file0"), ArticuloControlador.subir);

module.exports = router;