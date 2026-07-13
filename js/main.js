/**
 * Inserta un archivo HTML dentro de un contenedor.
 *
 * @param {HTMLElement} contenedor
 * @param {string} ruta
 */
async function insertarComponente(contenedor, ruta) {
    const respuesta = await fetch(ruta);

    if (!respuesta.ok) {
        throw new Error(
            `No se pudo cargar "${ruta}". Estado HTTP: ${respuesta.status}`
        );
    }

    contenedor.innerHTML = await respuesta.text();
}


/**
 * Carga las secciones declaradas con data-component.
 */
async function cargarComponentesIniciales() {
    const contenedores = document.querySelectorAll("[data-component]");

    const cargas = Array.from(contenedores).map(async (contenedor) => {
        const ruta = contenedor.dataset.component;

        try {
            contenedor.setAttribute("aria-busy", "true");

            await insertarComponente(contenedor, ruta);
        } catch (error) {
            console.error(error);

            contenedor.innerHTML = `
                <div class="component-error" role="alert">
                    <h2>No pudimos cargar esta sección</h2>

                    <p>
                        Error ):
                    </p>
                </div>
            `;
        } finally {
            contenedor.removeAttribute("aria-busy");
        }
    });

    await Promise.all(cargas);
}


/**
 * Detecta clics en elementos cargados dinámicamente.
 */
document.addEventListener("click", async (evento) => {
    const enlaceLanzamiento = evento.target.closest("[data-release]");

    if (enlaceLanzamiento) {
        evento.preventDefault();

        const detalle = document.querySelector("#detalle-lanzamiento");
        const ruta = enlaceLanzamiento.dataset.release;

        if (!detalle || !ruta) {
            return;
        }

        detalle.hidden = false;
        detalle.setAttribute("aria-busy", "true");

        detalle.innerHTML = `
            <p class="component-status">
                Cargando información del lanzamiento...
            </p>
        `;

        try {
            await insertarComponente(detalle, ruta);

            history.replaceState(
                null,
                "",
                "#detalle-lanzamiento"
            );

            requestAnimationFrame(() => {
                detalle.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        } catch (error) {
            console.error(error);

            detalle.innerHTML = `
                <div class="component-error" role="alert">
                    <h2>No pudimos abrir el lanzamiento</h2>

                    <p>
                        Revisa que el archivo del lanzamiento exista.
                    </p>
                </div>
            `;
        } finally {
            detalle.removeAttribute("aria-busy");
        }

        return;
    }

    const botonCerrar = evento.target.closest("[data-close-release]");

    if (botonCerrar) {
        const detalle = document.querySelector("#detalle-lanzamiento");
        const lanzamientos = document.querySelector("#lanzamientos");

        if (!detalle) {
            return;
        }

        detalle.hidden = true;
        detalle.innerHTML = "";

        history.replaceState(
            null,
            "",
            "#lanzamientos"
        );

        lanzamientos?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
});


cargarComponentesIniciales();

/**
 * Carga el archivo HTML correspondiente al detalle de un video.
 *
 * @param {HTMLElement} contenedor
 * @param {string} ruta
 */
async function cargarDetalleDeVideo(contenedor, ruta) {
    const respuesta = await fetch(ruta);

    if (!respuesta.ok) {
        throw new Error(
            `No se pudo cargar el detalle del video. Estado: ${respuesta.status}`
        );
    }

    contenedor.innerHTML = await respuesta.text();
}


/**
 * Abre y cierra las fichas individuales de los videos.
 */
document.addEventListener("click", async (evento) => {
    const enlaceVideo = evento.target.closest("[data-video-detail]");

    if (enlaceVideo) {
        evento.preventDefault();

        const galeriaVideos = document.querySelector("#videos");
        const detalleVideo = document.querySelector("#detalle-video");
        const rutaDetalle = enlaceVideo.dataset.videoDetail;

        if (!galeriaVideos || !detalleVideo || !rutaDetalle) {
            return;
        }

        galeriaVideos.hidden = true;
        detalleVideo.hidden = false;
        detalleVideo.setAttribute("aria-busy", "true");

        detalleVideo.innerHTML = `
            <p class="component-status">
                Cargando video...
            </p>
        `;

        try {
            await cargarDetalleDeVideo(
                detalleVideo,
                rutaDetalle
            );

            history.replaceState(
                null,
                "",
                "#detalle-video"
            );

            requestAnimationFrame(() => {
                detalleVideo.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        } catch (error) {
            console.error(error);

            detalleVideo.innerHTML = `
                <div class="component-error" role="alert">
                    <h2>No pudimos abrir el video</h2>

                    <p>
                        Revisa que el archivo del detalle exista
                        y que Live Server esté activo.
                    </p>
                </div>
            `;
        } finally {
            detalleVideo.removeAttribute("aria-busy");
        }

        return;
    }

    const botonCerrarVideo = evento.target.closest("[data-close-video]");

    if (botonCerrarVideo) {
        const galeriaVideos = document.querySelector("#videos");
        const detalleVideo = document.querySelector("#detalle-video");

        if (!galeriaVideos || !detalleVideo) {
            return;
        }

        detalleVideo.hidden = true;
        detalleVideo.innerHTML = "";

        galeriaVideos.hidden = false;

        history.replaceState(
            null,
            "",
            "#videos"
        );

        requestAnimationFrame(() => {
            galeriaVideos.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }
});