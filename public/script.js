function mostrarSeccion(seccion) {
    document.querySelectorAll('.seccion').forEach(sec => sec.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
}

// Crear artículo con imagen
document.getElementById('formCrear').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Enviar datos del artículo (sin imagen)
    const datos = {
        titulo: formData.get('titulo'),
        contenido: formData.get('contenido'),
        fecha: formData.get('fecha')
    };

    let res = await fetch('/api/crear', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
    });
    let json = await res.json();

    // Si hay imagen, subirla
    if (json.articulo && formData.get('imgUrl') && formData.get('imgUrl').name) {
        const imgForm = new FormData();
        imgForm.append('file0', formData.get('imgUrl'));
        res = await fetch(`/api/subir-imagen/${json.articulo._id}`, {
            method: 'POST',
            body: imgForm
        });
        const imgJson = await res.json();
        if (imgJson.status === "success") {
            document.getElementById('crearResultado').innerText = "Artículo creado y imagen subida correctamente.";
        } else {
            document.getElementById('crearResultado').innerText = "Artículo creado, pero hubo un problema al subir la imagen.";
        }
    } else {
        document.getElementById('crearResultado').innerText = json.mensaje || JSON.stringify(json);
    }
    form.reset();
};

// Actualizar artículo con imagen
document.getElementById('formActualizar').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const id = formData.get('id');

    // Enviar datos del artículo (sin imagen)
    const datos = {};
    if (formData.get('titulo')) datos.titulo = formData.get('titulo');
    if (formData.get('contenido')) datos.contenido = formData.get('contenido');
    if (formData.get('fecha')) datos.fecha = formData.get('fecha');

    let res = await fetch(`/api/actualizar/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
    });
    let json = await res.json();

    // Si hay imagen, subirla
    if (json.articulo && formData.get('imgUrl') && formData.get('imgUrl').name) {
        const imgForm = new FormData();
        imgForm.append('file0', formData.get('imgUrl'));
        res = await fetch(`/api/subir-imagen/${id}`, {
            method: 'POST',
            body: imgForm
        });
        const imgJson = await res.json();
        if (imgJson.status === "success") {
            document.getElementById('actualizarResultado').innerText = "Artículo actualizado y nueva imagen subida correctamente.";
        } else {
            document.getElementById('actualizarResultado').innerText = "Artículo actualizado, pero hubo un problema al subir la imagen.";
        }
    } else {
        document.getElementById('actualizarResultado').innerText = json.mensaje || JSON.stringify(json);
    }
    form.reset();
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

// Listar artículos con fichas técnicas
async function cargarArticulos() {
    const res = await fetch('/api/listar');
    const json = await res.json();
    const contenedor = document.getElementById('listaArticulos');
    contenedor.innerHTML = '';
    if (json.consulta && Array.isArray(json.consulta)) {
        json.consulta.forEach(a => {
            contenedor.innerHTML += `
                <div class="articulo-ficha">
                    <div class="articulo-imagen">
                        <img src="${a.imgUrl && a.imgUrl !== 'default.png' ? a.imgUrl : 'https://via.placeholder.com/120'}" alt="Imagen del artículo" />
                    </div>
                    <div class="articulo-info">
                        <h3>${a.titulo}</h3>
                        <p>${a.contenido}</p>
                        <ul>
                            <li><b>Fecha:</b> ${a.fecha ? new Date(a.fecha).toLocaleDateString() : 'Sin fecha'}</li>
                            <li><b>ID:</b> ${a._id}</li>
                        </ul>
                    </div>
                </div>
            `;
        });
    } else {
        contenedor.innerText = 'No hay artículos para mostrar.';
    }
}

// Mostrar la sección de crear por defecto
mostrarSeccion('crear');