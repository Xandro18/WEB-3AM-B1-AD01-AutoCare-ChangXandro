// ============================================
// 1. VARIABLES GLOBALES
// ============================================

// Arreglo que almacena los usuarios registrados
let usuarios = [];

// Arreglo que almacena los mantenimientos registrados
let mantenimientos = [];

// Arreglo que almacena los vehículos registrados
let vehiculos = [];

// Variable que almacena el usuario que inició sesión
let usuarioActual = null;


// ============================================
// 2. CLAVES DE ALMACENAMIENTO
// ============================================

// Definir las claves utilizadas en localStorage
const CLAVE_USUARIOS = "autocare_usuarios";
const CLAVE_MANTENIMIENTOS = "autocare_mantenimientos";
const CLAVE_VEHICULOS = "autocare_vehiculos";
const CLAVE_SESION = "autocare_sesion";

// ============================================
// 2.1. CREAR ADMINISTRADOR PREDETERMINADO
// ============================================

// Esta función crea o actualiza la cuenta administradora.
function crearAdministradorPredeterminado() {

    // Credenciales del administrador de AutoCare.
    const correoAdmin = "yancarlochan@gmail.com";
    const passwordAdmin = "Xandro1810";

    // Datos de la cuenta administradora.
    const administrador = {
        id: "admin-autocare",
        nombre: "Xandro Chang",
        correo: correoAdmin,
        telefono: "0961700600",
        password: passwordAdmin,
        rol: "Administrador"
    };

    // Buscar si ya existe una cuenta administradora.
    const indiceAdmin = usuarios.findIndex(
        usuario => usuario.rol === "Administrador"
    );

    // Si existe, actualizar sus datos.
    if (indiceAdmin !== -1) {

        usuarios[indiceAdmin] = administrador;

    } else {

        // Si no existe, crearla.
        usuarios.push(administrador);

    }

    // Guardar los datos actualizados.
    guardarUsuarios();

    console.log("Administrador de AutoCare configurado correctamente.");
}

// ============================================
// 2.2. CREAR CLIENTES Y VEHÍCULOS PREDETERMINADOS
// ============================================

// Esta función registra los dos clientes y sus vehículos
// automáticamente, siempre que todavía no existan.

function crearClientesYVehiculosPredeterminados() {

    // Datos de los clientes predeterminados.
    const clientesPredeterminados = [
        {
            id: "cliente-juan-david",
            nombre: "Juan David Vallecilla Rodriguez",
            correo: "juan.david.vallecilla01@gmail.com",
            telefono: "0979585537",
            password: "01dejulio",
            rol: "Cliente"
        },
        {
            id: "cliente-brais-yoas",
            nombre: "Brais Yoas Garcia Castillo",
            correo: "braisvallecilla@gmail.com",
            telefono: "0987950410",
            password: "12345678",
            rol: "Cliente"
        }
    ];

    // Registrar los clientes sin duplicarlos.
    clientesPredeterminados.forEach(cliente => {

        const existe = usuarios.find(
            usuario =>
                usuario.correo.toLowerCase() === cliente.correo.toLowerCase()
        );

        // Si no existe, agregarlo.
        if (!existe) {
            usuarios.push(cliente);
        }

    });

    // Guardar los usuarios.
    guardarUsuarios();

    // Buscar los identificadores reales de los propietarios.
    const juan = usuarios.find(
        usuario =>
            usuario.correo.toLowerCase() ===
            "juan.david.vallecilla01@gmail.com"
    );

    const brais = usuarios.find(
        usuario =>
            usuario.correo.toLowerCase() ===
            "braisvallecilla@gmail.com"
    );

    // Vehículos predeterminados.
    const vehiculosPredeterminados = [
        {
            id: "vehiculo-juan-bmw",
            usuarioId: juan.id,
            placa: "EDG1530",
            marca: "BMW",
            modelo: "BMW M5",
            anio: 2019,
            color: ""
        },
        {
            id: "vehiculo-brais-raize",
            usuarioId: brais.id,
            placa: "EDF",
            marca: "Toyota",
            modelo: "Raize",
            anio: 2020,
            color: ""
        },
        {
            id: "vehiculo-brais-corolla",
            usuarioId: brais.id,
            placa: "EDF2930",
            marca: "Toyota",
            modelo: "Corolla Cross",
            anio: 2015,
            color: ""
        }
    ];

    // Registrar los vehículos sin duplicar sus placas.
    vehiculosPredeterminados.forEach(vehiculo => {

        const existe = vehiculos.some(
            registrado =>
                registrado.placa.toUpperCase() ===
                vehiculo.placa.toUpperCase()
        );

        if (!existe) {
            vehiculos.push(vehiculo);
        }

    });

    // Guardar los vehículos.
    guardarVehiculos();

}

// ============================================
// 3. CARGAR DATOS DEL SISTEMA
// ============================================

function cargarDatos() {

    // Obtener los datos almacenados en el navegador.
    try {
        usuarios = JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    } catch (error) {
        usuarios = [];
        console.error("Error al cargar los usuarios:", error);
    }

    try {
        mantenimientos = JSON.parse(
            localStorage.getItem(CLAVE_MANTENIMIENTOS)
        ) || [];
    } catch (error) {
        mantenimientos = [];
        console.error("Error al cargar los mantenimientos:", error);
    }

    try {
        vehiculos = JSON.parse(
            localStorage.getItem(CLAVE_VEHICULOS)
        ) || [];
    } catch (error) {
        vehiculos = [];
        console.error("Error al cargar los vehículos:", error);
    }

    // Recuperar la sesión del usuario.
    try {
        usuarioActual = JSON.parse(
            localStorage.getItem(CLAVE_SESION)
        ) || null;
    } catch (error) {
        usuarioActual = null;
        localStorage.removeItem(CLAVE_SESION);
    }

    // Verificar que la sesión todavía pertenezca a un usuario registrado.
    if (usuarioActual) {

        const usuarioRegistrado = usuarios.find(
            usuario => usuario.id === usuarioActual.id
        );

        if (usuarioRegistrado) {

            // Recuperamos los datos actualizados del usuario,
            // sin guardar su contraseña dentro de la sesión.
            usuarioActual = {
                id: usuarioRegistrado.id,
                nombre: usuarioRegistrado.nombre,
                correo: usuarioRegistrado.correo,
                rol: usuarioRegistrado.rol
            };

            guardarSesion();

        } else {

            usuarioActual = null;
            localStorage.removeItem(CLAVE_SESION);

        }
    }
}


// ============================================
// 4. GUARDAR DATOS DEL SISTEMA
// ============================================

// Guardar los usuarios registrados.
function guardarUsuarios() {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

// Guardar los mantenimientos registrados.
function guardarMantenimientos() {
    localStorage.setItem(
        CLAVE_MANTENIMIENTOS,
        JSON.stringify(mantenimientos)
    );
}

// Guardar los vehículos registrados.
function guardarVehiculos() {
    localStorage.setItem(CLAVE_VEHICULOS, JSON.stringify(vehiculos));
}

// Guardar la sesión actual.
function guardarSesion() {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(usuarioActual));
}


// ============================================
// 5. ACTUALIZAR AÑO DEL FOOTER
// ============================================

function actualizarAnio() {

    // Obtener el elemento que muestra el año.
    const elementoAnio = document.getElementById("anioActual");

    // Actualizar con el año actual.
    if (elementoAnio) {
        elementoAnio.textContent = new Date().getFullYear();
    }
}


// ============================================
// 6. CONFIGURAR MODALES
// ============================================

function configurarModales() {

    const modalLoginElemento = document.getElementById("modalLogin");
    const modalRegistroElemento = document.getElementById("modalRegistro");

    // Verificar que existan los modales y Bootstrap.
    if (
        !modalLoginElemento ||
        !modalRegistroElemento ||
        typeof bootstrap === "undefined"
    ) {
        return;
    }

    // Crear instancias de los modales de Bootstrap.
    const modalLogin = bootstrap.Modal.getOrCreateInstance(
        modalLoginElemento
    );

    const modalRegistro = bootstrap.Modal.getOrCreateInstance(
        modalRegistroElemento
    );

    // Obtener los botones para cambiar de modal.
    const abrirRegistro = document.getElementById("abrirRegistro");
    const volverLogin = document.getElementById("volverLogin");

    // Abrir el formulario de registro.
    if (abrirRegistro) {

        abrirRegistro.addEventListener("click", function () {

            modalLoginElemento.addEventListener(
                "hidden.bs.modal",
                function () {
                    modalRegistro.show();
                },
                { once: true }
            );

            modalLogin.hide();
        });
    }

    // Regresar al formulario de inicio de sesión.
    if (volverLogin) {

        volverLogin.addEventListener("click", function () {

            modalRegistroElemento.addEventListener(
                "hidden.bs.modal",
                function () {
                    modalLogin.show();
                },
                { once: true }
            );

            modalRegistro.hide();
        });
    }
}


// ============================================
// 7. REGISTRAR USUARIO
// ============================================

async function registrarUsuario(event) {

    event.preventDefault();

    // Obtener los datos del formulario.
    const nombre = document.getElementById("registroNombre").value.trim();

    const correo = document.getElementById("registroCorreo")
        .value.trim().toLowerCase();

    const telefono = document.getElementById("registroTelefono")
        .value.trim();

    const password = document.getElementById("registroPassword").value;

    const confirmar = document.getElementById("registroConfirmar").value;

    // Validar que los campos no estén vacíos.
    if (!nombre || !correo || !telefono || !password || !confirmar) {

        await Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Completa todos los campos del formulario."
        });

        return;
    }

    // Validar que las contraseñas coincidan.
    if (password !== confirmar) {

        await Swal.fire({
            icon: "warning",
            title: "Contraseñas diferentes",
            text: "Las contraseñas ingresadas no coinciden."
        });

        return;
    }

    // Verificar si el correo ya está registrado.
    const usuarioExiste = usuarios.some(
        usuario => usuario.correo.toLowerCase() === correo
    );

    if (usuarioExiste) {

        await Swal.fire({
            icon: "warning",
            title: "Correo registrado",
            text: "Ya existe una cuenta con este correo electrónico."
        });

        return;
    }

    // Crear el nuevo usuario.
    const nuevoUsuario = {

        id: Date.now(),

        nombre: nombre,

        correo: correo,

        telefono: telefono,

        password: password,

        rol: "Cliente"
    };

    // Agregar el usuario al arreglo.
    usuarios.push(nuevoUsuario);

    // Guardar los usuarios.
    guardarUsuarios();

    // Actualizar el panel administrativo si está visible.
    if (
        usuarioActual &&
        usuarioActual.rol === "Administrador"
    ) {
        actualizarPanelAdmin();
    }

    // Limpiar el formulario.
    document.getElementById("formRegistro").reset();

    // Mostrar mensaje de confirmación.
    await Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Tu cuenta ha sido creada correctamente.",
        confirmButtonColor: "#14283f"
    });

    // Cerrar el modal de registro y abrir el de login.
    const modalRegistroElemento = document.getElementById("modalRegistro");
    const modalLoginElemento = document.getElementById("modalLogin");

    if (modalRegistroElemento && modalLoginElemento) {

        const modalRegistro = bootstrap.Modal.getOrCreateInstance(
            modalRegistroElemento
        );

        const modalLogin = bootstrap.Modal.getOrCreateInstance(
            modalLoginElemento
        );

        modalRegistroElemento.addEventListener(
            "hidden.bs.modal",
            function () {
                modalLogin.show();
            },
            { once: true }
        );

        modalRegistro.hide();
    }
}


// ============================================
// 8. INICIAR SESIÓN
// ============================================

// Esta función permite validar las credenciales
// y determinar qué tipo de panel debe visualizar el usuario.
function iniciarSesion(event) {

    event.preventDefault();

    // Obtenemos los datos ingresados en el formulario.
    const correo = document.getElementById("loginCorreo")
        .value.trim().toLowerCase();

    const password = document.getElementById("loginPassword").value;

    // Buscamos un usuario que coincida con las credenciales.
    const usuarioEncontrado = usuarios.find(usuario =>
        usuario.correo.toLowerCase() === correo &&
        usuario.password === password
    );

    // Comprobamos si las credenciales son incorrectas.
    if (!usuarioEncontrado) {

        Swal.fire({
            icon: "error",
            title: "Acceso denegado",
            text: "El correo o la contraseña son incorrectos."
        });

        return;
    }

    // Guardamos los datos del usuario sin incluir su contraseña.
    usuarioActual = {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.nombre,
        correo: usuarioEncontrado.correo,
        rol: usuarioEncontrado.rol
    };

    // Guardamos la sesión actual.
    guardarSesion();

    // Cerramos la ventana de inicio de sesión.
    const elementoModal = document.getElementById("modalLogin");

    if (elementoModal && typeof bootstrap !== "undefined") {

        const modal = bootstrap.Modal.getInstance(elementoModal);

        if (modal) {
            modal.hide();
        }
    }

    // Comprobamos el rol para mostrar el panel correspondiente.
    if (usuarioActual.rol === "Administrador") {

        // Mostramos el panel administrativo.
        mostrarPanelAdmin();

        Swal.fire({
            icon: "success",
            title: "Bienvenido administrador",
            text: "Has iniciado sesión correctamente."
        });

    } else {

        // Mostramos el panel del cliente.
        mostrarPanelCliente();

        Swal.fire({
            icon: "success",
            title: "Bienvenido",
            text: `Hola ${usuarioActual.nombre}, has iniciado sesión.`
        });
    }
}


// ============================================
// 9. CONFIGURAR AUTENTICACIÓN
// ============================================

function configurarAutenticacion() {

    // Obtener los formularios.
    const formularioLogin = document.getElementById("formLogin");

    const formularioRegistro = document.getElementById("formRegistro");

    // Configurar el evento de inicio de sesión.
    if (formularioLogin) {
        formularioLogin.addEventListener("submit", iniciarSesion);
    }

    // Configurar el evento de registro.
    if (formularioRegistro) {
        formularioRegistro.addEventListener("submit", registrarUsuario);
    }
}


// ============================================
// 10. MOSTRAR PANEL DEL CLIENTE
// ============================================

function mostrarPanelCliente() {

    // Verificar que exista un usuario cliente activo.
    if (!usuarioActual || usuarioActual.rol !== "Cliente") {
        return;
    }

    // Ocultar las secciones públicas.
    const seccionesPublicas = [
        "inicio",
        "servicios",
        "nosotros",
        "contacto"
    ];

    seccionesPublicas.forEach(id => {

        const seccion = document.getElementById(id);

        if (seccion) {
            seccion.classList.add("d-none");
        }
    });

    // Ocultar el panel administrativo.
    const panelAdmin = document.getElementById("panelAdmin");

    if (panelAdmin) {
        panelAdmin.classList.add("d-none");
    }

    // Mostrar el panel del cliente.
    const panelCliente = document.getElementById("panelCliente");

    if (panelCliente) {
        panelCliente.classList.remove("d-none");
    }

    // Actualizar el nombre del usuario.
    const nombreUsuario = document.getElementById("nombreUsuario");

    if (nombreUsuario) {
        nombreUsuario.textContent = usuarioActual.nombre;
    }

    // Actualizar los datos del panel.
    actualizarPanelCliente();

    // Mostrar los vehículos registrados.
    mostrarVehiculos();

    // Actualizar las opciones de vehículos para mantenimiento.
    mostrarOpcionesVehiculos();

    // Configurar la fecha del formulario.
    configurarFechaMantenimiento();

    // Mostrar la parte superior de la página.
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ============================================
// 11. OCULTAR PANEL DEL CLIENTE
// ============================================

function ocultarPanelCliente() {

    // Ocultar el panel del cliente.
    const panelCliente = document.getElementById("panelCliente");

    if (panelCliente) {
        panelCliente.classList.add("d-none");
    }

    // Regresar al inicio de la página.
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ============================================
// 12. ACTUALIZAR PANEL DEL CLIENTE
// ============================================

function actualizarPanelCliente() {

    // Verificar que exista un usuario activo.
    if (!usuarioActual) {
        return;
    }

    // Obtener los mantenimientos del usuario actual.
    const misMantenimientos = mantenimientos.filter(
        mantenimiento => mantenimiento.usuarioId === usuarioActual.id
    );

    // Calcular el total de mantenimientos.
    const total = misMantenimientos.length;

    // Calcular los mantenimientos pendientes.
    const pendientes = misMantenimientos.filter(
        mantenimiento => mantenimiento.estado === "Pendiente"
    ).length;

    // Calcular los mantenimientos finalizados.
    const finalizados = misMantenimientos.filter(
        mantenimiento => mantenimiento.estado === "Finalizado"
    ).length;

    // Actualizar los indicadores del panel.
    const elementoTotal = document.getElementById("totalMantenimientos");
    const elementoPendientes = document.getElementById("totalPendientes");
    const elementoFinalizados = document.getElementById("totalFinalizados");

    if (elementoTotal) elementoTotal.textContent = total;
    if (elementoPendientes) elementoPendientes.textContent = pendientes;
    if (elementoFinalizados) elementoFinalizados.textContent = finalizados;

    // Obtener la tabla del historial.
    const tabla = document.getElementById("tablaMisMantenimientos");

    // Verificar que exista la tabla.
    if (!tabla) {
        return;
    }

    // Limpiar el contenido anterior.
    tabla.innerHTML = "";

    // Mostrar mensaje cuando no existan solicitudes.
    if (misMantenimientos.length === 0) {

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 5;
        celda.className = "text-center";
        celda.textContent =
            "No tienes solicitudes de mantenimiento registradas.";

        fila.appendChild(celda);
        tabla.appendChild(fila);

        return;
    }

    // Recorrer los mantenimientos registrados.
    misMantenimientos.forEach(mantenimiento => {

        const fila = document.createElement("tr");

        // Crear las celdas de la fila.
        const datos = [
            mantenimiento.codigo || mantenimiento.id,
            mantenimiento.vehiculo,
            mantenimiento.servicio,
            mantenimiento.fecha,
            mantenimiento.estado
        ];

        datos.forEach(dato => {

            const celda = document.createElement("td");

            celda.textContent = dato ?? "";

            fila.appendChild(celda);
        });

        // Mostrar la descripción como información adicional.
        fila.title = mantenimiento.descripcion || "";

        // Agregar la fila a la tabla.
        tabla.appendChild(fila);
    });
}


// ============================================
// 13. REGISTRAR VEHÍCULO
// ============================================

async function registrarVehiculo(event) {

    event.preventDefault();

    // Verificar que exista un usuario activo.
    if (!usuarioActual || usuarioActual.rol !== "Cliente") {
        return;
    }

    // Obtener los datos del formulario.
    const placa = document.getElementById("vehiculoPlaca")
        .value.trim().toUpperCase();

    const marca = document.getElementById("vehiculoMarca").value.trim();

    const modelo = document.getElementById("vehiculoModelo").value.trim();

    const anio = Number(document.getElementById("vehiculoAnio").value);

    const color = document.getElementById("vehiculoColor").value.trim();

    // Validar que los campos estén completos.
    if (!placa || !marca || !modelo || !color) {

        await Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Completa todos los datos del vehículo."
        });

        return;
    }

    // Validar el año del vehículo.
    if (!Number.isInteger(anio) || anio < 1950 || anio > 2099) {

        await Swal.fire({
            icon: "warning",
            title: "Año no válido",
            text: "Ingresa un año entre 1950 y 2099."
        });

        return;
    }

    // Verificar que la placa no esté registrada.
    const placaExiste = vehiculos.some(
        vehiculo => vehiculo.placa.toUpperCase() === placa
    );

    if (placaExiste) {

        await Swal.fire({
            icon: "warning",
            title: "Placa registrada",
            text: "Ya existe un vehículo registrado con esta placa."
        });

        return;
    }

    // Crear el nuevo vehículo.
    const nuevoVehiculo = {

        id: Date.now(),

        usuarioId: usuarioActual.id,

        placa: placa,

        marca: marca,

        modelo: modelo,

        anio: anio,

        color: color
    };

    // Agregar el vehículo al arreglo.
    vehiculos.push(nuevoVehiculo);

    // Guardar los vehículos.
    guardarVehiculos();

    // Limpiar el formulario.
    document.getElementById("formVehiculo").reset();

    // Actualizar la tabla de vehículos.
    mostrarVehiculos();

    // Actualizar las opciones del formulario de mantenimiento.
    mostrarOpcionesVehiculos();

    // Actualizar el panel administrativo si está abierto.
    if (
        usuarioActual.rol === "Administrador"
    ) {
        actualizarPanelAdmin();
    }

    // Mostrar mensaje de confirmación.
    await Swal.fire({
        icon: "success",
        title: "Vehículo registrado",
        text: "El vehículo se ha registrado correctamente.",
        confirmButtonColor: "#14283f"
    });
}


// ============================================
// 14. MOSTRAR VEHÍCULOS
// ============================================

function mostrarVehiculos() {

    // Verificar que exista un usuario activo.
    if (!usuarioActual) {
        return;
    }

    // Obtener los vehículos del usuario actual.
    const misVehiculos = vehiculos.filter(
        vehiculo => vehiculo.usuarioId === usuarioActual.id
    );

    // Obtener la tabla de vehículos.
    const tabla = document.getElementById("tablaMisVehiculos");

    // Verificar que exista la tabla.
    if (!tabla) {
        return;
    }

    // Limpiar el contenido anterior.
    tabla.innerHTML = "";

    // Mostrar mensaje cuando no existan vehículos.
    if (misVehiculos.length === 0) {

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 6;
        celda.className = "text-center";
        celda.textContent = "No tienes vehículos registrados.";

        fila.appendChild(celda);
        tabla.appendChild(fila);

        return;
    }

    // Recorrer los vehículos registrados.
    misVehiculos.forEach(vehiculo => {

        const fila = document.createElement("tr");

        // Crear las celdas con los datos del vehículo.
        const datos = [
            vehiculo.placa,
            vehiculo.marca,
            vehiculo.modelo,
            vehiculo.anio,
            vehiculo.color
        ];

        datos.forEach(dato => {

            const celda = document.createElement("td");

            celda.textContent = dato ?? "";

            fila.appendChild(celda);
        });

        // Agregar la fila a la tabla.
        tabla.appendChild(fila);
    });
}


// ============================================
// 15. CONFIGURAR FORMULARIO DE VEHÍCULOS
// ============================================

function configurarVehiculos() {

    // Obtener el formulario de vehículos.
    const formulario = document.getElementById("formVehiculo");

    // Verificar que exista el formulario.
    if (!formulario) {
        return;
    }

    // Escuchar el envío del formulario.
    formulario.addEventListener("submit", registrarVehiculo);
}


// ============================================
// 16. CERRAR SESIÓN
// ============================================

async function cerrarSesion() {

    // Confirmar el cierre de sesión.
    const resultado = await Swal.fire({

        icon: "question",

        title: "Cerrar sesión",

        text: "¿Estás seguro de que deseas salir de AutoCare?",

        showCancelButton: true,

        confirmButtonText: "Cerrar sesión",

        cancelButtonText: "Cancelar",

        confirmButtonColor: "#14283f"
    });

    // Verificar la decisión del usuario.
    if (!resultado.isConfirmed) {
        return;
    }

    // Eliminar los datos de la sesión actual.
    usuarioActual = null;

    localStorage.removeItem(CLAVE_SESION);

    // Ocultar ambos paneles.
    ocultarPanelCliente();
    ocultarPanelAdmin();

    // Mostrar nuevamente las secciones públicas.
    mostrarSeccionesPublicas();

    // Mostrar confirmación.
    await Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        text: "Has cerrado sesión correctamente."
    });
}


// ============================================
// 17. MOSTRAR PANEL ADMINISTRATIVO
// ============================================

// Esta función oculta las secciones públicas y muestra
// el panel exclusivo del administrador.
function mostrarPanelAdmin() {

    // Verificar que el usuario tenga permisos de administrador.
    if (!usuarioActual || usuarioActual.rol !== "Administrador") {
        return;
    }

    // Ocultar las secciones públicas.
    ocultarSeccionesPublicas();

    // Ocultar el panel del cliente.
    const panelCliente = document.getElementById("panelCliente");

    if (panelCliente) {
        panelCliente.classList.add("d-none");
    }

    // Mostrar el panel administrativo.
    const panelAdmin = document.getElementById("panelAdmin");

    if (panelAdmin) {
        panelAdmin.classList.remove("d-none");
    }

    // Actualizar el nombre del administrador.
    const nombreAdministrador = document.getElementById(
        "nombreAdministrador"
    );

    if (nombreAdministrador) {
        nombreAdministrador.textContent = usuarioActual.nombre;
    }

    // Actualizar la información administrativa.
    actualizarPanelAdmin();

    // Mostrar la parte superior de la página.
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ============================================
// 18. OCULTAR PANEL ADMINISTRATIVO
// ============================================

// Esta función oculta el panel administrativo.
function ocultarPanelAdmin() {

    const panelAdmin = document.getElementById("panelAdmin");

    if (panelAdmin) {
        panelAdmin.classList.add("d-none");
    }
}


// ============================================
// 18.1. CONTROLAR SECCIONES PÚBLICAS
// ============================================

// Ocultar las secciones principales de la página.
function ocultarSeccionesPublicas() {

    const seccionesPublicas = [
        "inicio",
        "servicios",
        "nosotros",
        "contacto"
    ];

    seccionesPublicas.forEach(id => {

        const seccion = document.getElementById(id);

        if (seccion) {
            seccion.classList.add("d-none");
        }
    });
}


// Mostrar nuevamente las secciones principales.
function mostrarSeccionesPublicas() {

    const seccionesPublicas = [
        "inicio",
        "servicios",
        "nosotros",
        "contacto"
    ];

    seccionesPublicas.forEach(id => {

        const seccion = document.getElementById(id);

        if (seccion) {
            seccion.classList.remove("d-none");
        }
    });
}


// ============================================
// 19. ACTUALIZAR INFORMACIÓN ADMINISTRATIVA
// ============================================

// Esta función calcula los indicadores y muestra
// la información general de AutoCare.
function actualizarPanelAdmin() {

    // Verificar que el usuario sea administrador.
    if (!usuarioActual || usuarioActual.rol !== "Administrador") {
        return;
    }

    // Calcular la cantidad total de usuarios clientes.
    const totalUsuarios = usuarios.filter(
        usuario => usuario.rol === "Cliente"
    ).length;

    // Obtener la cantidad total de vehículos.
    const totalVehiculos = vehiculos.length;

    // Calcular la cantidad total de mantenimientos.
    const totalMantenimientos = mantenimientos.length;

    // Actualizar los indicadores del administrador.
    const elementoUsuarios = document.getElementById(
        "adminTotalUsuarios"
    );

    const elementoVehiculos = document.getElementById(
        "adminTotalVehiculos"
    );

    const elementoMantenimientos = document.getElementById(
        "adminTotalMantenimientos"
    );

    if (elementoUsuarios) {
        elementoUsuarios.textContent = totalUsuarios;
    }

    if (elementoVehiculos) {
        elementoVehiculos.textContent = totalVehiculos;
    }

    if (elementoMantenimientos) {
        elementoMantenimientos.textContent = totalMantenimientos;
    }

    // Mostrar las tablas administrativas.
    mostrarUsuariosAdmin();
    mostrarVehiculosAdmin();
    mostrarMantenimientosAdmin();
}

// ============================================
// 20. MOSTRAR Y ADMINISTRAR USUARIOS
// ============================================

// Esta función muestra los clientes y sus opciones de administración.
function mostrarUsuariosAdmin() {

    const tabla = document.getElementById("tablaUsuariosAdmin");

    if (!tabla) {
        return;
    }

    // No mostrar la cuenta administradora.
    const clientes = usuarios.filter(
        usuario => usuario.rol === "Cliente"
    );

    tabla.innerHTML = "";

    if (clientes.length === 0) {

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 5;
        celda.className = "text-center";
        celda.textContent = "No existen clientes registrados.";

        fila.appendChild(celda);
        tabla.appendChild(fila);

        return;
    }

    clientes.forEach(usuario => {

        const fila = document.createElement("tr");

        // Mostrar los datos del usuario.
        const datos = [
            usuario.nombre,
            usuario.correo,
            usuario.telefono,
            usuario.rol
        ];

        datos.forEach(dato => {

            const celda = document.createElement("td");
            celda.textContent = dato ?? "";
            fila.appendChild(celda);

        });

        // Crear la celda de acciones.
        const celdaAcciones = document.createElement("td");

        // Botón para editar.
        const botonEditar = document.createElement("button");

        botonEditar.type = "button";
        botonEditar.className = "btn btn-warning btn-sm me-2";
        botonEditar.textContent = "Editar";

        botonEditar.addEventListener("click", function () {
            editarUsuario(usuario.id);
        });

        // Botón para eliminar.
        const botonEliminar = document.createElement("button");

        botonEliminar.type = "button";
        botonEliminar.className = "btn btn-danger btn-sm";
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", function () {
            eliminarUsuario(usuario.id);
        });

        celdaAcciones.appendChild(botonEditar);
        celdaAcciones.appendChild(botonEliminar);

        fila.appendChild(celdaAcciones);

        tabla.appendChild(fila);
    });
}


// ============================================
// 20.1. EDITAR USUARIOS
// ============================================

// Permite al administrador modificar los datos de un cliente.
async function editarUsuario(id) {

    if (!usuarioActual || usuarioActual.rol !== "Administrador") {
        return;
    }

    const usuario = usuarios.find(
        item => String(item.id) === String(id)
    );

    if (!usuario || usuario.rol !== "Cliente") {
        return;
    }

    // Solicitar el nuevo nombre.
    const resultadoNombre = await Swal.fire({
        title: "Modificar nombre",
        input: "text",
        inputValue: usuario.nombre,
        inputPlaceholder: "Nombre completo",
        showCancelButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        inputValidator: valor => {
            if (!valor.trim()) {
                return "El nombre no puede estar vacío.";
            }
        }
    });

    if (!resultadoNombre.isConfirmed) return;

    // Solicitar el nuevo correo.
    const resultadoCorreo = await Swal.fire({
        title: "Modificar correo",
        input: "email",
        inputValue: usuario.correo,
        inputPlaceholder: "Correo electrónico",
        showCancelButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        inputValidator: valor => {
            if (!valor.trim()) {
                return "Ingresa un correo electrónico.";
            }
        }
    });

    if (!resultadoCorreo.isConfirmed) return;

    const nuevoCorreo = resultadoCorreo.value.trim().toLowerCase();

    // Comprobar que el correo no pertenezca a otra cuenta.
    const correoExiste = usuarios.some(
        item =>
            String(item.id) !== String(id) &&
            item.correo.toLowerCase() === nuevoCorreo
    );

    if (correoExiste) {

        await Swal.fire({
            icon: "warning",
            title: "Correo ocupado",
            text: "Otro usuario ya utiliza ese correo."
        });

        return;
    }

    // Solicitar el nuevo teléfono.
    const resultadoTelefono = await Swal.fire({
        title: "Modificar teléfono",
        input: "text",
        inputValue: usuario.telefono,
        inputPlaceholder: "Número de teléfono",
        showCancelButton: true,
        confirmButtonText: "Guardar cambios",
        cancelButtonText: "Cancelar",
        inputValidator: valor => {
            if (!valor.trim()) {
                return "El teléfono no puede estar vacío.";
            }
        }
    });

    if (!resultadoTelefono.isConfirmed) return;

    // Guardar los nuevos datos.
    usuario.nombre = resultadoNombre.value.trim();
    usuario.correo = nuevoCorreo;
    usuario.telefono = resultadoTelefono.value.trim();

    guardarUsuarios();

    // Actualizar la información administrativa.
    actualizarPanelAdmin();

    await Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        text: "Los datos del cliente se modificaron correctamente."
    });
}


// ============================================
// 20.2. ELIMINAR USUARIOS
// ============================================

// Permite al administrador eliminar un cliente y sus registros.
async function eliminarUsuario(id) {

    if (!usuarioActual || usuarioActual.rol !== "Administrador") {
        return;
    }

    const usuario = usuarios.find(
        item => String(item.id) === String(id)
    );

    // Evitar eliminar la cuenta administradora.
    if (!usuario || usuario.rol !== "Cliente") {
        return;
    }

    const resultado = await Swal.fire({

        icon: "warning",

        title: "¿Eliminar usuario?",

        text: `Se eliminará a ${usuario.nombre}, sus vehículos y sus mantenimientos. Esta acción no se puede deshacer.`,

        showCancelButton: true,

        confirmButtonText: "Sí, eliminar",

        cancelButtonText: "Cancelar",

        confirmButtonColor: "#dc3545"
    });

    if (!resultado.isConfirmed) {
        return;
    }

    // Eliminar al usuario.
    usuarios = usuarios.filter(
        item => String(item.id) !== String(id)
    );

    // Eliminar los vehículos pertenecientes al usuario.
    vehiculos = vehiculos.filter(
        item => String(item.usuarioId) !== String(id)
    );

    // Eliminar los mantenimientos pertenecientes al usuario.
    mantenimientos = mantenimientos.filter(
        item => String(item.usuarioId) !== String(id)
    );

    // Guardar todos los cambios.
    guardarUsuarios();
    guardarVehiculos();
    guardarMantenimientos();

    // Actualizar el panel administrativo.
    actualizarPanelAdmin();

    await Swal.fire({
        icon: "success",
        title: "Usuario eliminado",
        text: "El cliente y sus registros asociados fueron eliminados correctamente."
    });
}


// ============================================
// 21. MOSTRAR VEHÍCULOS REGISTRADOS
// ============================================

// Esta función permite al administrador consultar
// todos los vehículos registrados en AutoCare.
function mostrarVehiculosAdmin() {

    const tabla = document.getElementById("tablaVehiculosAdmin");

    if (!tabla) {
        return;
    }

    tabla.innerHTML = "";

    // Mostrar mensaje cuando no existan vehículos.
    if (vehiculos.length === 0) {

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 5;
        celda.className = "text-center";
        celda.textContent = "No existen vehículos registrados.";

        fila.appendChild(celda);
        tabla.appendChild(fila);

        return;
    }

    // Recorrer todos los vehículos registrados.
    vehiculos.forEach(vehiculo => {

        const fila = document.createElement("tr");

        // Buscamos al propietario del vehículo.
        const propietario = usuarios.find(
            usuario => usuario.id === vehiculo.usuarioId
        );

        const datos = [
            vehiculo.placa,
            vehiculo.marca,
            vehiculo.modelo,
            vehiculo.anio,
            propietario ? propietario.nombre : "No disponible"
        ];

        datos.forEach(dato => {

            const celda = document.createElement("td");

            celda.textContent = dato ?? "";

            fila.appendChild(celda);
        });

        tabla.appendChild(fila);
    });
}


// ============================================
// 22. MOSTRAR SOLICITUDES DE MANTENIMIENTO
// ============================================

// Esta función permite consultar todas las solicitudes
// realizadas por los clientes.
function mostrarMantenimientosAdmin() {

    const tabla = document.getElementById(
        "tablaMantenimientosAdmin"
    );

    if (!tabla) {
        return;
    }

    tabla.innerHTML = "";

    // Mostrar mensaje cuando no existan solicitudes.
    if (mantenimientos.length === 0) {

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 6;
        celda.className = "text-center";
        celda.textContent =
            "No existen solicitudes de mantenimiento.";

        fila.appendChild(celda);
        tabla.appendChild(fila);

        return;
    }

    // Recorrer todas las solicitudes registradas.
    mantenimientos.forEach(mantenimiento => {

        const fila = document.createElement("tr");

        // Buscamos al cliente que realizó la solicitud.
        const cliente = usuarios.find(
            usuario => usuario.id === mantenimiento.usuarioId
        );

        // Buscar el vehículo relacionado con la solicitud.
        // Se utiliza vehiculoId y también se contempla la placa
        // de los registros creados con la versión anterior.
        const vehiculo = vehiculos.find(
            item =>
                item.id === mantenimiento.vehiculoId ||
                item.placa === mantenimiento.vehiculo
        );

        // Agregar el identificador.
        const celdaId = document.createElement("td");
        celdaId.textContent =
            mantenimiento.codigo || mantenimiento.id;

        fila.appendChild(celdaId);

        // Agregar el nombre del cliente.
        const celdaCliente = document.createElement("td");
        celdaCliente.textContent =
            cliente ? cliente.nombre : "No disponible";

        fila.appendChild(celdaCliente);

        // Agregar la placa del vehículo.
        const celdaVehiculo = document.createElement("td");
        celdaVehiculo.textContent =
            vehiculo ? vehiculo.placa : mantenimiento.vehiculo || "No disponible";

        fila.appendChild(celdaVehiculo);

        // Agregar el servicio.
        const celdaServicio = document.createElement("td");
        celdaServicio.textContent = mantenimiento.servicio || "";

        fila.appendChild(celdaServicio);

        // Agregar la fecha.
        const celdaFecha = document.createElement("td");
        celdaFecha.textContent = mantenimiento.fecha || "";

        fila.appendChild(celdaFecha);

        // Crear el selector para cambiar el estado.
        const celdaEstado = document.createElement("td");
        const selector = document.createElement("select");

        selector.className = "form-select";

        const estados = [
            "Pendiente",
            "En proceso",
            "Finalizado"
        ];

        estados.forEach(estado => {

            const opcion = document.createElement("option");

            opcion.value = estado;
            opcion.textContent = estado;
            opcion.selected = mantenimiento.estado === estado;

            selector.appendChild(opcion);
        });

        // Cambiar el estado cuando el administrador seleccione otra opción.
        selector.addEventListener("change", function () {

            cambiarEstadoMantenimiento(
                mantenimiento.id,
                this.value
            );
        });

        celdaEstado.appendChild(selector);
        fila.appendChild(celdaEstado);

        tabla.appendChild(fila);
    });
}


// ============================================
// 23. CAMBIAR ESTADO DE MANTENIMIENTO
// ============================================

// Esta función permite al administrador modificar
// el estado de una solicitud.
function cambiarEstadoMantenimiento(id, nuevoEstado) {

    // Verificar que el usuario sea administrador.
    if (!usuarioActual || usuarioActual.rol !== "Administrador") {
        return;
    }

    // Comprobar que el estado sea válido.
    const estadosPermitidos = [
        "Pendiente",
        "En proceso",
        "Finalizado"
    ];

    if (!estadosPermitidos.includes(nuevoEstado)) {
        return;
    }

    // Buscamos la solicitud correspondiente.
    const mantenimiento = mantenimientos.find(
        item => String(item.id) === String(id)
    );

    // Verificamos que exista el mantenimiento.
    if (!mantenimiento) {
        return;
    }

    // Actualizamos el estado.
    mantenimiento.estado = nuevoEstado;

    // Guardamos los cambios en localStorage.
    guardarMantenimientos();

    // Actualizamos las tablas e indicadores.
    actualizarPanelAdmin();

    // Actualizar el panel del cliente si corresponde.
    // El administrador no necesita visualizar el panel del cliente.
    Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `La solicitud ahora está: ${nuevoEstado}.`
    });
}


// ============================================
// 24. INICIALIZAR EL SISTEMA
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    // Cargar los datos almacenados.
    cargarDatos();

    // Crear la cuenta administradora si todavía no existe.
    crearAdministradorPredeterminado();

    // Crear los clientes y vehículos predeterminados.
    crearClientesYVehiculosPredeterminados();

    // Actualizar el año del footer.
    actualizarAnio();

    // Configurar los modales.
    configurarModales();

    // Configurar los formularios de autenticación.
    configurarAutenticacion();

    // Configurar el formulario de vehículos.
    configurarVehiculos();

    // Configurar el formulario de mantenimientos.
    configurarMantenimientos();

    // Verificar si existe una sesión activa.
    if (usuarioActual) {

        // Mostrar el panel según el rol del usuario.
        if (usuarioActual.rol === "Administrador") {

            mostrarPanelAdmin();

        } else {

            mostrarPanelCliente();

        }
    }

    // Mostrar mensaje en la consola.
    console.log("Sistema AutoCare inicializado correctamente.");
});


// ============================================
// 25. MOSTRAR VEHÍCULOS EN EL FORMULARIO
// ============================================

function mostrarOpcionesVehiculos() {

    // Obtener el selector de vehículos.
    const selectVehiculo = document.getElementById(
        "mantenimientoVehiculo"
    );

    // Verificar que exista el selector y el usuario.
    if (!selectVehiculo || !usuarioActual) {
        return;
    }

    // Obtener los vehículos del usuario actual.
    const misVehiculos = vehiculos.filter(
        vehiculo => vehiculo.usuarioId === usuarioActual.id
    );

    // Limpiar las opciones anteriores.
    selectVehiculo.innerHTML =
        '<option value="">Selecciona un vehículo</option>';

    // Agregar los vehículos registrados.
    misVehiculos.forEach(vehiculo => {

        const opcion = document.createElement("option");

        opcion.value = vehiculo.id;

        opcion.textContent =
            `${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}`;

        selectVehiculo.appendChild(opcion);
    });
}


// ============================================
// 26. REGISTRAR SOLICITUD DE MANTENIMIENTO
// ============================================

async function registrarMantenimiento(event) {

    event.preventDefault();

    // Verificar que exista una sesión activa.
    if (!usuarioActual || usuarioActual.rol !== "Cliente") {

        await Swal.fire({
            icon: "warning",
            title: "Sesión no encontrada",
            text: "Debes iniciar sesión para registrar una solicitud."
        });

        return;
    }

    // Obtener los datos del formulario.
    const vehiculoId = Number(
        document.getElementById("mantenimientoVehiculo").value
    );

    const servicio = document.getElementById(
        "mantenimientoServicio"
    ).value;

    const fecha = document.getElementById(
        "mantenimientoFecha"
    ).value;

    const descripcion = document.getElementById(
        "mantenimientoDescripcion"
    ).value.trim();

    // Buscar el vehículo seleccionado.
    const vehiculoSeleccionado = vehiculos.find(
        vehiculo =>
            vehiculo.id === vehiculoId &&
            vehiculo.usuarioId === usuarioActual.id
    );

    // Validar que el vehículo pertenezca al usuario.
    if (!vehiculoSeleccionado) {

        await Swal.fire({
            icon: "warning",
            title: "Vehículo no válido",
            text: "Selecciona uno de tus vehículos registrados."
        });

        return;
    }

    // Validar que existan todos los datos.
    if (!servicio || !fecha || !descripcion) {

        await Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Completa todos los campos del formulario."
        });

        return;
    }

    // Validar que la fecha no sea anterior al día actual.
    const fechaSeleccionada = new Date(`${fecha}T00:00:00`);

    const fechaActual = new Date();

    fechaActual.setHours(0, 0, 0, 0);

    if (
        Number.isNaN(fechaSeleccionada.getTime()) ||
        fechaSeleccionada < fechaActual
    ) {

        await Swal.fire({
            icon: "warning",
            title: "Fecha no válida",
            text: "La fecha de solicitud no puede ser anterior al día actual."
        });

        return;
    }

    // Crear el registro de mantenimiento.
    const nuevoMantenimiento = {

        id: Date.now(),

        codigo: `MNT-${Date.now()}`,

        usuarioId: usuarioActual.id,

        // Guardamos el ID y la placa para relacionar correctamente
        // el mantenimiento con su vehículo en las tablas administrativas.
        vehiculoId: vehiculoSeleccionado.id,

        vehiculo: vehiculoSeleccionado.placa,

        servicio: servicio,

        fecha: fecha,

        descripcion: descripcion,

        estado: "Pendiente"
    };

    // Agregar el mantenimiento al arreglo.
    mantenimientos.push(nuevoMantenimiento);

    // Guardar los cambios en localStorage.
    guardarMantenimientos();

    // Limpiar el formulario.
    document.getElementById("formMantenimiento").reset();

    // Establecer nuevamente la fecha mínima.
    configurarFechaMantenimiento();

    // Actualizar el historial y los indicadores.
    actualizarPanelCliente();

    // Mostrar mensaje de confirmación.
    await Swal.fire({
        icon: "success",
        title: "Solicitud registrada",
        text: `Tu solicitud ${nuevoMantenimiento.codigo} fue registrada correctamente.`,
        confirmButtonColor: "#14283f"
    });
}


// ============================================
// 27. CONFIGURAR FORMULARIO DE MANTENIMIENTO
// ============================================

function configurarMantenimientos() {

    // Obtener el formulario de mantenimiento.
    const formulario = document.getElementById("formMantenimiento");

    // Verificar que exista el formulario.
    if (!formulario) {
        return;
    }

    // Escuchar el envío del formulario.
    formulario.addEventListener("submit", registrarMantenimiento);

    // Cargar los vehículos disponibles.
    mostrarOpcionesVehiculos();

    // Configurar la fecha del formulario.
    configurarFechaMantenimiento();
}


// ============================================
// 28. CONFIGURAR FECHA DE MANTENIMIENTO
// ============================================

function configurarFechaMantenimiento() {

    // Obtener el campo de fecha.
    const campoFecha = document.getElementById(
        "mantenimientoFecha"
    );

    // Verificar que exista el campo.
    if (!campoFecha) {
        return;
    }

    // Obtener la fecha local actual.
    const hoy = new Date();

    const anio = hoy.getFullYear();

    const mes = String(hoy.getMonth() + 1).padStart(2, "0");

    const dia = String(hoy.getDate()).padStart(2, "0");

    const fechaActual = `${anio}-${mes}-${dia}`;

    // Establecer la fecha mínima.
    campoFecha.min = fechaActual;

    // Establecer la fecha actual como valor predeterminado.
    if (!campoFecha.value) {
        campoFecha.value = fechaActual;
    }
}