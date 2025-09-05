const fs = require("fs");
//const { validarArticulo } = require("../helpers/validar")
const Articulo = require("../modelos/articulo");
const { validarArticulo } = require("../helpers/validar");

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy una accion de prueba de mi controlador de articulos"
    });
}

const curso = (req, res) => {
    console.log("Se ha ejectuado el endpint probando");
    return res.status(200).send(
        ` <h1>Hola mundo al Desarrollo WEB en UMG</h1>
        `
    )
}

//Guardar el articulo en la base de datos
const crear = async (req, res) => {
    //Recoger los parametros por post a guardar
    let parametros = req.body;

    //Validar los datos
    try {
        validarArticulo(parametros);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "faltan datos por enviar"
        });
    }

    //Crear el objeto guardar
    const articulo = new Articulo(parametros);

    //Asiginar valores a objeto basado en en el modelo (manual o automatico)
    //articulo.titulo = parametros.titulo;

    //Guardar el articulo en la base de datos
    const articuloGuardado = await articulo.save();
    return res.status(200).json({
        status: "success",
        articulo: articuloGuardado,
        mensaje: "Articulo creado con exito",
    });

    //Devolver el resultado
    return res.status(200).json({
        mensaje: "Acción de guardar",
        parametros
    });
}


const listar = async (req, res) => {
    try {
        const ultimos = req.params.ultimos || null;

        const consulta = await Articulo.find({})
            .sort({ fecha: -1 })
            .limit(ultimos)

        if (!consulta || consulta.length === 0) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se han encontrado articulos",
            });
        }
        return res.status(200).send({
            status: "success",
            parametro: req.params.ultimos,
            contador: consulta.length,
            consulta,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Ha ocurrido un error al listar",
        });
    }
};


const uno = (req, res) => {
    // Recoger un id por la url
    let id = req.params.id;

    // Buscar artículo
    Articulo.findById(id)
        .then((articulo) => {
            // Si no existe, devolver error
            if (!articulo) {
                return res.status(400).json({
                    status: "Error",
                    mensaje: "No se ha encontrado el artículo",
                });
            }

            // Devolver resultado
            return res.status(200).json({
                status: "Success",
                articulo,
            });
        })
        .catch((error) => {
            500
            return res.status(400).json({
                status: "Error",
                mensaje: "Ha ocurrido un error al buscar el artículo",
            });
        });
};

const borrar = async (req, res) => {
    try {
        const articulo_id = req.params.id;
        const articuloBorrado = await Articulo.findOneAndDelete({ _id: articulo_id });

        if (!articuloBorrado) {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al borrar el artículo"
            });
        }

        return res.status(200).json({
            status: "Success",
            articulo: articuloBorrado,
            mensaje: "Método de borrar"
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al borrar el artículo"
        });
    }
}
const editar = async (req, res) => {
    try {
        // Recoger id del artículo a editar
        const articuloId = req.params.id;

        // Recoger datos del body
        const parametros = req.body;

        // Validar datos
        try {
            validarArticulo(parametros);
        } catch (error) {
            return res.status(400).json({
                status: "error",
                mensaje: "faltan datos por enviar"
            });
        }

        // Buscar y actualizar artículo utilizando async/await y promesas
        const articuloActualizado = await Articulo.findOneAndUpdate(
            { _id: articuloId },
            parametros,
            { new: true } // Para devolver el artículo actualizado
        );

        if (!articuloActualizado) {
            return res.status(500).json({
                status: "Error",
                mensaje: "Error al actualizar"
            });
        }

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado
        });

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos para enviar"
        });
    }
};

const subir = async (req, res) => {
    try {
        // Verificar si se recibió un archivo
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha enviado ninguna imagen"
            });
        }

        // Validar extensión del archivo
        const archivo_split = req.file.originalname.split(".");
        const archivo_extension = archivo_split[archivo_split.length - 1].toLowerCase();
        if (!["png", "jpg", "jpeg", "gif"].includes(archivo_extension)) {
            // Eliminar archivo no válido
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                status: "error",
                mensaje: "Extensión de imagen no válida (solo png, jpg, jpeg, gif)"
            });
        }

        // Actualizar el artículo con el nombre de la imagen subida
        const articuloId = req.params.id;
        const articuloActualizado = await Articulo.findOneAndUpdate(
            { _id: articuloId },
            { imgUrl: req.file.filename },
            { new: true }
        );

        if (!articuloActualizado) {
            // Si no existe el artículo, eliminar la imagen subida
            fs.unlinkSync(req.file.path);
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró el artículo para actualizar la imagen"
            });
        }

        return res.status(200).json({
            status: "success",
            mensaje: "Imagen subida y artículo actualizado correctamente",
            articulo: articuloActualizado,
            archivo: req.file
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error en el servidor al subir la imagen"
        });
    }
};

module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir
}