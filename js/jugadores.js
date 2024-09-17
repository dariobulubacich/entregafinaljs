document.addEventListener("DOMContentLoaded", () => {
    const formJugador = document.getElementById("form-jugador");
    const listaJugadores = document.getElementById("lista-jugadores");
    const carnetsContainer = document.getElementById("carnets-container");
    const cargarJugadoresBtn = document.getElementById("cargar-jugadores");
    const selectClub = document.getElementById("select-club");
    const btnImprimirFiltro = document.getElementById("btn-imprimir-filtro");

    let jugadores = [];

    formJugador.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const club = document.getElementById("club").value;
        const apellido = document.getElementById("apellido").value;
        const fechaNacimiento = document.getElementById("fechaNacimiento").value;

        const jugador = { nombre, club, apellido, fechaNacimiento };

        jugadores.push(jugador);
        actualizarListaJugadores();
        generarCarnet(jugador);
        actualizarSelectClub();

        Swal.fire({
            icon: 'success',
            title: 'Jugador agregado',
            text: `Has agregado a ${nombre} ${apellido}`,
        });

        formJugador.reset();
    });

    cargarJugadoresBtn.addEventListener("click", () => {
        fetch('/data/jugadores.json')
            .then(response => response.json())
            .then(data => {
                jugadores = data;
                actualizarListaJugadores();
                data.forEach(jugador => generarCarnet(jugador));
                actualizarSelectClub();
                Swal.fire({
                    icon: 'success',
                    text: 'Los jugadores se Cargaron con Exito.'
                });
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar los jugadores.'
                });
            });
    });

    function actualizarListaJugadores() {
        listaJugadores.innerHTML = ""; 
        jugadores.forEach((jugador) => {
            const li = document.createElement("li");
            li.textContent = `${jugador.nombre} - ${jugador.apellido} - ${jugador.club}`;
            listaJugadores.appendChild(li);
        });
    }

    function generarCarnet(jugador) {
        const carnetDiv = document.createElement("div");
        carnetDiv.classList.add("carnet");

        carnetDiv.innerHTML = `
            <img src="https://via.placeholder.com/100" alt="Foto del Jugador">
            <p><strong>Nombre:</strong> ${jugador.nombre}</p>
            <p><strong>Apellido:</strong> ${jugador.apellido}</p>
            <p><strong>Club:</strong> ${jugador.club}</p>
            <p><strong>F. Nac:</strong> ${jugador.fechaNacimiento}</p>
        `;

        carnetsContainer.appendChild(carnetDiv);
    }

    function actualizarSelectClub() {
        const clubes = [...new Set(jugadores.map(jugador => jugador.club))];
        selectClub.innerHTML = '<option value="">-- Selecciona un Club --</option>';
        clubes.forEach(club => {
            const option = document.createElement("option");
            option.value = club;
            option.textContent = club;
            selectClub.appendChild(option);
        });
    }

    selectClub.addEventListener("change", () => {
        const clubSeleccionado = selectClub.value;
        filtrarCarnetsPorClub(clubSeleccionado);
    });

    function filtrarCarnetsPorClub(club) {
        carnetsContainer.innerHTML = "";
        const jugadoresFiltrados = jugadores.filter(jugador => jugador.club === club);
        jugadoresFiltrados.forEach(jugador => generarCarnet(jugador));
    }

    btnImprimirFiltro.addEventListener("click", () => {
        const clubSeleccionado = selectClub.value;
        if (!clubSeleccionado) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor selecciona un club antes de imprimir.'
            });
            return;
        }

        const carnetsParaImprimir = carnetsContainer.cloneNode(true);

        const ventanaImpresion = window.open('', '', 'width=800,height=600');
        ventanaImpresion.document.write(`
            <html>
                <head>
                    <title>Imprimir Carnets</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                        }
                    </style>
                </head>
                <body>
                    ${carnetsParaImprimir.outerHTML}
                    <script>
                        window.onload = function() {
                            window.print();
                            window.close();
                        };
                    </script>
                </body>
            </html>
        `);
        ventanaImpresion.document.close();
    });
});
