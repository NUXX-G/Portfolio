// URL base de la API, la guardo aqui para no repetirla en cada fetch
const url = "https://www.dnd5eapi.co/api";

//Estas variables globales se usan para la funcion de descargar plantilla, esto por la tarea adicional de que se puedan ver las stats ;), I LOVE GRANADA
let razaGuardada = null;
let claseGuardada = null;

let contador = 0;

/**
 * @description Esperamos a que todo este cargado completamente para llamar a las funciones
 * y asi no tener ningun error inesperado ;).
 */
document.addEventListener("DOMContentLoaded", () => {
    cargarRazas();
    cargarClases();
    cargarAlineamientos();

    document.getElementById("btn-generar").addEventListener("click", () => {
        generar();
    });

    document.getElementById("btn-aleatorio").addEventListener("click", () => {
        generarAleatorio();
    });

    document.getElementById("btn-plantilla").addEventListener("click", () => {
        descargarPlantilla();
    });

    document.getElementById("btn-limpiar").addEventListener("click", () => {
        limpiarPlantilla();
    });
});

/**
 * @brief Carga las razas del endpoint
 * @description Aqui es donde se carga y muestran todas las razas de la api en el html
 * para ello hacemos un fetch, usando la const global que se llama url y le añadimos /races, esot lo hago
 * basicamente para pillar la parte de razas simplemente y no todo despues lo pasamos a un json
 * para asi poder manipular los datos, y con un for each recorremos todo y lo vamos mostrando en el html
 * usando el innerHtml y el appendChild
 */
function cargarRazas() 
{
    const select = document.getElementById("select-raza");
    fetch(url + "/races")
        .then(respuesta => respuesta.json())
        .then(datos => {
            select.innerHTML = '<option value="">Elige una raza</option>';
            datos.results.forEach(raza => {
                const opcion = document.createElement("option");
                opcion.value = raza.index;
                opcion.textContent = raza.name;
                select.appendChild(opcion);
            });
        })
        .catch(error => {
            select.innerHTML = '<option value="">Error: ' + error.message + '</option>';
        });
}

/**
 * @brief Carga las clases del endpoint
 * @description Exactamente lo mismo que cargarRazas(), pero esta vez añadomos /classes, esto para pillar obviamente la parte de clases
 * 
 */
function cargarClases()
{
    const select = document.getElementById("select-clase")
    fetch(url + "/classes")
        .then(respuesta => respuesta.json())
        .then(datos => {
            select.innerHTML = '<option value="">Elige una clase</option>';
            datos.results.forEach(clase => {
                const opcion = document.createElement("option");
                opcion.value = clase.index;
                opcion.textContent = clase.name;
                select.appendChild(opcion);
            });
        })
        .catch(error => {
            select.innerHTML = '<option value="">Error: ' + error.message + '</option>';
        });
}

/**
 * @brief Carga los alineamiento del endpoint
 * @description Exactamente igual que cargarRaza() y cargarClases(), pero esta vez con /alignments
 */
function cargarAlineamientos()
{
    const select = document.getElementById("select-alineamiento")
    fetch(url + "/alignments")
        .then(respuesta => respuesta.json())
        .then(datos => {
            select.innerHTML = '<option value="">Elige un alineamiento</option>';
            datos.results.forEach(alineamiento => {
                const opcion = document.createElement("option");
                opcion.value = alineamiento.index;
                opcion.textContent = alineamiento.name;
                select.appendChild(opcion);
            });
        })
        .catch(error => {
            select.innerHTML = '<option value="">Error: ' + error.message + '</option>';
        });
}

/**
 * @brief Muestra la ficha del personaje creado
 * @description Crea el html de la ficha del personaje con los datos que nos devolvio la api
 * y lo mete en el div ficha-personaje, tambien elimino la clase oculto para que se vea
 * @param  nombre - Nombre del personaje que escribio el usuario
 * @param  raza - Todos los datos de la raza que devolvio la API
 * @param  clase - Todos los datos de la clase que devolvio la API
 * @param  alineamiento - Texto del alineamiento que selecciono el usuario
 */
function mostrarFicha(nombre, raza, clase, alineamiento)
{
    razaGuardada = raza;
    claseGuardada = clase;
    const ficha = document.getElementById("ficha-personaje");
    let bonos = "";
    raza.ability_bonuses.forEach(bono => {
        bonos = bonos + bono.ability_score.name + " +" + bono.bonus + " ";
    });

    let STR = 10;
    let DEX = 10;
    let CON = 10;
    let INT = 10;
    let WIS = 10;
    let CHA = 10;

    raza.ability_bonuses.forEach(bono => {
        if (bono.ability_score.name === "STR") { STR += bono.bonus; }
        if (bono.ability_score.name === "DEX") { DEX += bono.bonus; }
        if (bono.ability_score.name === "CON") { CON += bono.bonus; }
        if (bono.ability_score.name === "INT") { INT += bono.bonus; }
        if (bono.ability_score.name === "WIS") { WIS += bono.bonus; }
        if (bono.ability_score.name === "CHA") { CHA += bono.bonus; }
    });

    fetch(url + "/classes/" + clase.index + "/spells")
        .then(respuesta => respuesta.json())
        .then(datosSpells => {
            let conjuro = "Esta clase no tiene conjuros";
        if (datosSpells.results.length > 0) 
        {
            conjuro = datosSpells.results[Math.floor(Math.random() * datosSpells.results.length)].name;
        }                
            ficha.innerHTML = "<h2>" + nombre + "</h2>" 
                    + "<p><strong>Raza: </strong>" + raza.name + "</p>" 
                    + "<p><strong>Tamaño: </strong>" + raza.size + "</p>" 
                    + "<p><strong>Clase: </strong>" + clase.name + "</p>" 
                    + "<p><strong>Hechizo: </strong>" + conjuro +"</p>"
                    + "<p><strong>Vida: </strong>" + "d"+clase.hit_die + "</p>" 
                    + "<p><strong>Alineamiento: </strong>" + alineamiento + "</p>"
                    + "<p><strong>Bonificadores: </strong>" + bonos + "</p>"
                    + "<p><strong>STR: </strong>" + STR + " | <strong>DEX: </strong>" + DEX + " | <strong>CON: </strong>" + CON + "</p>"
                    + "<p><strong>INT: </strong>" + INT + " | <strong>WIS: </strong>" + WIS + " | <strong>CHA: </strong>" + CHA + "</p>";
            contador++;
            document.getElementById("contador-personajes").textContent = "Personajes generados: " + contador;
            ficha.classList.remove("oculto");
        });
}

/**
 * @brief Recoge los valores del formulario del html 
 * @description Pilla los valores del formulario, mira que no esten vacios
 * y hace dos fetch anidados (tienen que estar anidados porque necesito los dos a la vez) 
 * para obtener el detalle de la raza y la clase
 * Es la funcion que mas fallos puede dar y por eso tiene el try catch.
 */
function generar()
{
    const nombre = document.getElementById("input-nombre").value;
    const razaIndex = document.getElementById("select-raza").value;    
    const claseIndex = document.getElementById("select-clase").value;
    const alineamiento = document.getElementById("select-alineamiento").value;

    if (nombre === "" || razaIndex === "" || claseIndex === "" || alineamiento === "")    
    {
        alert("Compi, tienes que rellenar todos los campos para generar el personaje. ;)");
        return;
    }

    try {
        fetch(url + "/races/" + razaIndex)
            .then(respuesta => respuesta.json())
            .then(raza => {
                fetch(url + "/classes/" + claseIndex)
                    .then(respuesta => respuesta.json())
                    .then(clase => {
                        mostrarFicha(nombre, raza, clase, alineamiento);
                    })
                    .catch(error => {
                        alert("Error: " + error.message);
                    });
            })
            .catch(error => {
                alert("Error: " + error.message);
            });
    } catch (error) {
        alert("Error inesperado: " + error.message);
    }
}

/**
 * @brief Genera aleatoriamente todos los valores del formulario
 * @description Pide las tres listas a la API, elige un elemento al azar usando el math random y multiplicandolo
 * por el tamaño de la raza,clase... y despues usa el floor para redondear para abajo y asi tener un indice que sea
 * valido, despues cada una lo mete en los selects y llama a generar para que haga el resto
 */
function generarAleatorio()
{
    fetch(url + "/races")
        .then(respuesta => respuesta.json())
        .then(datosRazas => {
            const raza = datosRazas.results[Math.floor(Math.random() * datosRazas.results.length)];
                fetch(url + "/classes")
                    .then(respuesta => respuesta.json())
                    .then(datosClases => {
                        const clase = datosClases.results[Math.floor(Math.random() * datosClases.results.length)]
                            fetch(url + "/alignments")
                                .then(respuesta => respuesta.json())
                                .then(datosAlineamientos => {
                                    const alineamieto = datosAlineamientos.results[Math.floor(Math.random() * datosAlineamientos.results.length)]
                                    document.getElementById("select-raza").value = raza.index;
                                    document.getElementById("select-clase").value = clase.index;
                                    document.getElementById("select-alineamiento").value = alineamieto.index;
                                    document.getElementById("input-nombre").value = "Pedro Sanchez";
                                    generar();
                                });
                    });
        });
}


/**
 * @Brief Funcion que se usa para la tarea adicional del profesor
 * @description Carga el PDF de la plantilla, escribe los datos del personaje
 * en las coordenadas indicadas y lo descarga, esto es un trabajo de chinos,
 * lo de arrayBuffer, es necesario porque si no, pdf.lib no puede leer el archivo.
 * El PDFLib.PDFDocument.load, es la funcion de pdf-lib que carga el pdf, para asi poder modificarlo.
 * getPages()[0] esto lo uso basicamente para usar la primera pagina, porque no me da la vida para modificar todas las paginas del pdf
 * drawText esta es la funcion de pdf-lib para escribir texto, y le pasamos las cordenas x e y, y size es el tamaño de la fuente
 * pdfDoc.save esta la uso para guardar todos los cambios.
 * Blob esto convierte el pdf modificado en un objeto del navegador, para que lo pueda usar como un archivo normal, y con el type, pues le decimos cual es, en este caso un PDF.
 * URL.createObjectURL crea una url temporal para el blob, esto para que el navegador pueda acceder a el y poder descargarlo.
 * enlace.click() aqui creo un enlace visible para poder descargar el pdf.
 */
function descargarPlantilla()
{
    const nombre = document.getElementById("input-nombre").value;
    const raza = document.getElementById("select-raza").options[document.getElementById("select-raza").selectedIndex].text;
    const clase = document.getElementById("select-clase").options[document.getElementById("select-clase").selectedIndex].text;
    const alineamiento = document.getElementById("select-alineamiento").value;

    let STR = 10;
    let DEX = 10;
    let CON = 10;
    let INT = 10;
    let WIS = 10;
    let CHA = 10;

    if (razaGuardada !== null)
    {
        razaGuardada.ability_bonuses.forEach(bono => {
            if (bono.ability_score.name === "STR") { STR += bono.bonus; }
            if (bono.ability_score.name === "DEX") { DEX += bono.bonus; }
            if (bono.ability_score.name === "CON") { CON += bono.bonus; }
            if (bono.ability_score.name === "INT") { INT += bono.bonus; }
            if (bono.ability_score.name === "WIS") { WIS += bono.bonus; }
            if (bono.ability_score.name === "CHA") { CHA += bono.bonus; }
        });
    }

    fetch("../recursos/dnd-5ta-edicion-hoja-de-personaje-espanol1.pdf")
        .then(respuesta => respuesta.arrayBuffer())
        .then(pdfBytes => {
            PDFLib.PDFDocument.load(pdfBytes)
                .then(pdfDoc => {
                    const pagina = pdfDoc.getPages()[0];
                    pagina.drawText(nombre, { x: 90, y: 712, size: 15 });
                    pagina.drawText(raza, { x: 270, y: 702, size: 12 });
                    pagina.drawText(clase, { x: 270, y: 728, size: 12 });
                    pagina.drawText(alineamiento, { x: 378, y: 702, size: 12 });
                    pagina.drawText(String(STR), { x: 38, y: 615, size: 22 });
                    pagina.drawText(String(DEX), { x: 38, y: 540, size: 22 });
                    pagina.drawText(String(CON), { x: 38, y: 470, size: 22 });
                    pagina.drawText(String(INT), { x: 38, y: 395, size: 22 });
                    pagina.drawText(String(WIS), { x: 38, y: 325, size: 22 });
                    pagina.drawText(String(CHA), { x: 38, y: 255, size: 22 });
                    return pdfDoc.save();
                })
                .then(pdfModificado => {
                    const blob = new Blob([pdfModificado], { type: "application/pdf" });
                    const enlace = document.createElement("a");
                    enlace.href = URL.createObjectURL(blob);
                    enlace.download = "personaje.pdf";
                    enlace.click();
                });
        })
        .catch(error => {
            alert("Error al cargar la plantilla: " + error.message);
        });
}


function limpiarPlantilla()
{
    const ficha = document.getElementById("ficha-personaje");
    ficha.classList.add("oculto");
    ficha.innerHTML = "";
    document.getElementById("input-nombre").value = "";
    document.getElementById("select-raza").value = "";
    document.getElementById("select-clase").value = "";
    document.getElementById("select-alineamiento").value = "";

    contador = 0;
    razaGuardada = null;
    claseGuardada = null;

    document.getElementById("contador-personajes").textContent = "Personajes generados: " + contador;
}