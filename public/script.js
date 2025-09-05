function mostrarSeccion(seccion) {
    document.querySelectorAll('.seccion').forEach(sec => sec.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
}

// Crear artículo
document.getElementById('formCrear').onsubmit = async function(e) {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(this));
    const res = await fetch('/api/crear', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
    });
    const json = await res.json();
    document.getElementById('crearResultado').innerText = json.mensaje || JSON.stringify(json);
    this.reset();
};

// Actualizar artículo
document.getElementById('formActualizar').onsubmit = async function(e) {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(this));
    const id = datos.id;
    delete datos.id;
    const res = await fetch(`/api/actualizar/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
    });
    const json = await res.json();
    document.getElementById('actualizarResultado').innerText = json.mensaje || JSON.stringify(json);
    this.reset();
};

// Eliminar artículo
document.getElementById('formEliminar').onsubmit = async function(e) {
    e.preventDefault();
    const id = new FormData(this).get('id');
    const res = await fetch(`/api/borrar/${id}`, { method: 'DELETE' });
    const json = await res.json();
    document.getElementById('eliminarResultado').innerText = json.mensaje || JSON.stringify(json);
    this.reset();
};

// Listar artículos
async function cargarArticulos() {
    const res = await fetch('/api/listar');
    const json = await res.json();
    const contenedor = document.getElementById('listaArticulos');
    contenedor.innerHTML = '';
    if (json.consulta && Array.isArray(json.consulta)) {
        json.consulta.forEach(a => {
            contenedor.innerHTML += `
                <div class="articulo">
                    <h3>${a.titulo}</h3>
                    <p>${a.contenido}</p>
                    <small>Fecha: ${new Date(a.fecha).toLocaleDateString()}</small><br>
                    <img src="${a.imgUrl || 'default.png'}" alt="Imagen" />
                    <br><b>ID:</b> ${a._id}
                </div>
            `;
        });
    } else {
        contenedor.innerText = 'No hay artículos para mostrar.';
    }
}

// Mostrar la sección de crear por defecto
mostrarSeccion('crear');