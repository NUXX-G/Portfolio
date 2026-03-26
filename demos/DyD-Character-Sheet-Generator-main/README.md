# D&D 5e Character Sheet Generator

Proyecto web para el modulo de **Lenguajes de Marcas y Sistemas de Gestion de Informacion** del C.F.G.S. Desarrollo de Aplicaciones Multiplataforma en el CPIFP Alan Turing, Malaga.

## Descripcion

Aplicacion web que consume la [D&D 5e API](https://www.dnd5eapi.co/) para generar fichas de personaje de Dungeons & Dragons 5a Edicion. El usuario puede seleccionar raza, clase y alineamiento desde desplegables cargados con la API, o pulsar el boton de aleatorio y dejar que el destino decida. Los datos se muestran en una ficha generada dinamicamente en la pagina. Ademas, el usuario puede descargar la plantilla oficial en PDF con los datos del personaje ya rellenados, incluyendo nombre, raza, clase, alineamiento y estadisticas base.

## Estructura del proyecto
```
D&D_5E_API/
├── html/
│   ├── creador.html
│   └── sobreMi.html
├── imagenes/
├── js/
│   └── main.js
├── recursos/
│   ├── D&D5Manual.pdf
│   ├── dnd-5ta-edicion-hoja-de-personaje-espanol1.pdf
│   └── Video_tutorial_D&D.mp4
├── index.html
└── style.css
```

## API utilizada

**D&D 5e API** — https://www.dnd5eapi.co/

Endpoints utilizados:
- `/api/races` — lista de razas
- `/api/races/{index}` — detalle de una raza concreta
- `/api/classes` — lista de clases
- `/api/classes/{index}` — detalle de una clase concreta
- `/api/alignments` — lista de alineamientos

## Tecnologias

- HTML5
- CSS3 con animaciones keyframes
- JavaScript vanilla con fetch y .then()
- [pdf-lib](https://pdf-lib.js.org/) — libreria externa usada unicamente para la funcion de descarga de plantilla con datos. Necesaria porque es imposible modificar un PDF desde el navegador con JS puro.

## Funcionalidades

- Seleccion de raza, clase y alineamiento desde desplegables cargados con la API
- Generacion de personaje aleatorio tirando de la API directamente
- Ficha del personaje generada dinamicamente con raza, clase, alineamiento, vida, bonificadores y estadisticas base
- Descarga de la plantilla oficial en PDF con los datos del personaje rellenados automaticamente

## Autor

**Nelson Filipe Fardilha Karlsson**
C.F.G.S. Desarrollo de Aplicaciones Multiplataforma — CPIFP Alan Turing