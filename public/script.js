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

    const resultado = document.getElementById('crearResultado');

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
            resultado.innerHTML = `<div class="mensaje-exito">Artículo creado y imagen subida correctamente.</div>`;
        } else {
            resultado.innerHTML = `<div class="mensaje-error">Artículo creado, pero hubo un problema al subir la imagen.</div>`;
        }
    } else {
        if (json.status === "success") {
            resultado.innerHTML = `<div class="mensaje-exito">${json.mensaje || "Artículo creado correctamente."}</div>`;
        } else {
            resultado.innerHTML = `<div class="mensaje-error">${json.mensaje || "Error al crear el artículo."}</div>`;
        }
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

    const resultado = document.getElementById('actualizarResultado');

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
            resultado.innerHTML = `<div class="mensaje-exito">Artículo actualizado y nueva imagen subida correctamente.</div>`;
        } else {
            resultado.innerHTML = `<div class="mensaje-error">Artículo actualizado, pero hubo un problema al subir la imagen.</div>`;
        }
    } else {
        if (json.status === "success") {
            resultado.innerHTML = `<div class="mensaje-exito">${json.mensaje || "Artículo actualizado correctamente."}</div>`;
        } else {
            resultado.innerHTML = `<div class="mensaje-error">${json.mensaje || "Error al actualizar el artículo."}</div>`;
        }
    }
    form.reset();
};

// Eliminar artículo
document.getElementById('formEliminar').onsubmit = async function(e) {
    e.preventDefault();
    const id = new FormData(this).get('id');
    const res = await fetch(`/api/borrar/${id}`, { method: 'DELETE' });
    const json = await res.json();
    const resultado = document.getElementById('eliminarResultado');
    if (json.status === "Success" || json.status === "success") {
        resultado.innerHTML = `<div class="mensaje-exito">${json.mensaje || "Artículo eliminado correctamente."}</div>`;
    } else {
        resultado.innerHTML = `<div class="mensaje-error">${json.mensaje || "Error al eliminar el artículo."}</div>`;
    }
    this.reset();
};

// Listar artículos con fichas técnicas y mostrar imagen correctamente
async function cargarArticulos() {
    const res = await fetch('/api/listar');
    const json = await res.json();
    const contenedor = document.getElementById('listaArticulos');
    contenedor.innerHTML = '';
    if (json.consulta && Array.isArray(json.consulta)) {
        json.consulta.forEach(a => {
            // Construir la ruta de la imagen
            let imgSrc = 'https://via.placeholder.com/120';
            if (a.imgUrl && a.imgUrl !== 'default.png') {
                // Mostrar la ruta real para depuración
                imgSrc = `/imagenes/articulos/${a.imgUrl}`;
            }
            contenedor.innerHTML += `
                <div class="articulo-ficha">
                    <div class="articulo-imagen">
                        <img src="${imgSrc}" alt="Imagen del artículo" onerror="this.onerror=null;this.src='https://via.placeholder.com/120';" />
                    </div>
                    <div class="articulo-info">
                        <h3>${a.titulo}</h3>
                        <p>${a.contenido}</p>
                        <ul>
                            <li><b>Fecha:</b> ${a.fecha ? new Date(a.fecha).toLocaleDateString() : 'Sin fecha'}</li>
                            <li><b>ID:</b> ${a._id}</li>
                        </ul>
                        <small style="color:#888;">Ruta imagen: ${imgSrc}</small>
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