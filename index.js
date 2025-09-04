const { conexion } = require("./basededatos/conexion");
const express = require("express");
const cors = require("cors");

console.log("App de node arrancada");

conexion();

//Crear servidor Node
const app = express();
const puerto = 3900;

//Configurar cors
app.use(cors());

//Convertir body a objeto js
app.use(express.json());

//Crear rutas
const rutas_articulo = require("./rutas/articulo");

//Cargo las rutas
app.use("/api", rutas_articulo);

//Rutas de prueba hardcodeadas
app.get("/probando", (req, res) => {
    console.log("Se ha ejecutado el endpoint probando");

    return res.status(200).json([{
        curso: "Master en React",
        autor: "Carlos Arias",
        url: "www.stscloud.com.gt"
    },
    {
        curso: "Master en React",
        autor: "Carlos Arias",
        url: "www.stscloud.com.gt"
    },
    ]);
});


app.get("/", (req, res) => {
    console.log("Se ha ejecutado el endpoint probando");

    return res.status(200).send(
        `<h1>Empezando a crear un api rest con NODE</h1>
        `);
    
});

//Crear servidor y escucha de peticiones 
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto: " + puerto);
}
)