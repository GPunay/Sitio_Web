
document.addEventListener("DOMContentLoaded", () => {
    const articlesContainer = document.getElementById("articles-container");
    const articleForm = document.getElementById("article-form");

    // Cargar y mostrar artículos
    const fetchArticles = async () => {
        try {
            const response = await fetch("/api/articulos");
            if (!response.ok) {
                throw new Error("Error al cargar los artículos");
            }
            const articles = await response.json();

            articlesContainer.innerHTML = ""; // Limpiar artículos existentes
            articles.datos.forEach((article) => {
                const articleElement = document.createElement("div");
                articleElement.classList.add("article");
                articleElement.innerHTML = `
                    <h3>${article.titulo}</h3>
                    <p>${article.contenido}</p>
                    <div class="article-actions">
                        <button class="edit-btn" data-id="${article._id}">Editar</button>
                        <button class="delete-btn" data-id="${article._id}">Eliminar</button>
                    </div>
                `;
                articlesContainer.appendChild(articleElement);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Crear un nuevo artículo
    articleForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const titulo = document.getElementById("titulo").value;
        const contenido = document.getElementById("contenido").value;

        try {
            const response = await fetch("/api/crear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ titulo, contenido }),
            });

            if (!response.ok) {
                throw new Error("Error al crear el artículo");
            }

            await response.json();
            fetchArticles(); // Recargar la lista de artículos
            articleForm.reset();
        } catch (error) {
            console.error("Error:", error);
        }
    });

    // Manejar clics en los botones de eliminar y editar
    articlesContainer.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const articleId = e.target.dataset.id;
            try {
                const response = await fetch(`/api/articulo/${articleId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error("Error al eliminar el artículo");
                }

                fetchArticles(); // Recargar la lista de artículos
            } catch (error) {
                console.error("Error:", error);
            }
        }

        if (e.target.classList.contains("edit-btn")) {
            const articleId = e.target.dataset.id;
            const articleElement = e.target.closest(".article");
            const titulo = articleElement.querySelector("h3").textContent;
            const contenido = articleElement.querySelector("p").textContent;

            articleElement.innerHTML = `
                <form class="edit-form" data-id="${articleId}">
                    <input type="text" value="${titulo}" required>
                    <textarea required>${contenido}</textarea>
                    <button type="submit">Guardar</button>
                    <button type="button" class="cancel-btn">Cancelar</button>
                </form>
            `;
        }
    });

    // Manejar el envío de formularios de edición
    articlesContainer.addEventListener("submit", async (e) => {
        if (e.target.classList.contains("edit-form")) {
            e.preventDefault();
            const articleId = e.target.dataset.id;
            const titulo = e.target.querySelector("input").value;
            const contenido = e.target.querySelector("textarea").value;

            try {
                const response = await fetch(`/api/articulo/${articleId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ titulo, contenido }),
                });

                if (!response.ok) {
                    throw new Error("Error al actualizar el artículo");
                }

                fetchArticles(); // Recargar la lista de artículos
            } catch (error) {
                console.error("Error:", error);
            }
        }
    });

    // Manejar clics en el botón de cancelar
    articlesContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("cancel-btn")) {
            fetchArticles(); // Simplemente recargar los artículos para cancelar la edición
        }
    });

    fetchArticles();
});
