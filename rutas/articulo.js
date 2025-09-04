const express = require("express");
const multer = require("multer");
const router = express.Router();
const ArticuloControlador = require("../controladores/articulo");


const almacenamiento = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './imagenes/articulos');
    },
    filename: function(req,file,cb) {
        cb(null, "articulo" + Date.now() + file.originalname);
    }
})

const subidas = multer({storage: almacenamiento});

//Crear las rutas necesarias para acceder desde localhost/..ruta


//rutas de prueba
router.get("/ruta-de-prueba",ArticuloControlador.prueba);
router.get("/curso",ArticuloControlador.curso);

//ruta util
router.post("/crear",ArticuloControlador.crear);
router.get("/listar",ArticuloControlador.listar);
router.get("/articulo/:id",ArticuloControlador.uno);
router.delete("/borrar/:id",ArticuloControlador.borrar);
router.put("/actualizar/:id",ArticuloControlador.editar);
router.post("/subir-imagen/:id", subidas.single("file0"),ArticuloControlador.subir);

module.exports = router;