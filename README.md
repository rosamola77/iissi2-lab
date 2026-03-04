# 📷 Photo Gallery — Laboratorio IISSI-2

## Descripción del proyecto

Este repositorio contiene el proyecto de laboratorio de la asignatura **IISSI-2** (Introducción a la Ingeniería del Software y los Sistemas de Información 2) del **Grado en Ingeniería Informática — Tecnologías Informáticas** de la **Universidad de Sevilla**.

El proyecto consiste en una **galería de fotos web** desarrollada con el framework **Silence** (backend en Python + MySQL) y un frontend basado en **HTML, CSS (Bootstrap 5)** y **JavaScript vanilla** (ES6 modules). Permite a los usuarios registrarse, iniciar sesión, subir fotos, votar, comentar y explorar las fotos de otros usuarios.

### Estructura del repositorio

```
iissi2-lab/
├── settings.py                  ← Configuración de Silence (BD, puerto, etc.)
├── endpoints/
│   └── auto/                    ← Definiciones JSON de los endpoints REST
│       ├── photos.json
│       ├── users.json
│       ├── comments.json
│       ├── votes.json
│       ├── tags.json
│       └── ...
├── sql/
│   ├── create_tables.sql        ← Creación de tablas
│   ├── create_views.sql         ← Vistas SQL
│   └── populate_database.sql    ← Datos de ejemplo
└── web/                         ← Frontend
    ├── css/
    │   ├── bootstrap.min.css
    │   ├── font-awesome.min.css
    │   └── style.css            ← Estilos personalizados
    ├── images/                  ← Imágenes locales
    ├── js/
    │   ├── api/                 ← Módulos cliente REST (axios)
    │   ├── handlers/            ← Manejadores de formularios
    │   ├── renderers/           ← Funciones de renderizado DOM
    │   ├── utils/               ← Utilidades (sesión, include, parseHTML)
    │   └── libs/                ← Librerías externas (axios, bootstrap)
    ├── index.html               ← Página principal (galería)
    ├── header.html              ← Cabecera reutilizable
    ├── login.html               ← Inicio de sesión
    ├── register.html            ← Registro de usuario
    ├── upload_picture.html      ← Subir foto
    ├── photo_detail.html        ← Detalle de foto
    ├── trending_photos.html     ← Fotos en tendencia
    └── trending_users.html      ← Usuarios en tendencia
```

---

## Cómo hacer un fork del repositorio y arrancar el proyecto

### 1. Hacer un fork en GitHub

1. Entra en la página de este repositorio en GitHub.
2. Haz clic en el botón **Fork** (esquina superior derecha).
3. Selecciona tu cuenta como destino del fork.
4. Una vez creado, clona tu fork en tu máquina local:

```bash
git clone https://github.com/TU_USUARIO/iissi2-lab.git
cd iissi2-lab
```

### 2. Requisitos previos

- **Python 3.8+** instalado.
- **MySQL 8** (o MariaDB) instalado y en ejecución.
- **pip** (gestor de paquetes de Python).

### 3. Instalar Silence

```bash
pip install silence
```

> Si usas entorno virtual (recomendado):
> ```bash
> python -m venv venv
> source venv/bin/activate   # Linux/macOS
> venv\Scripts\activate      # Windows
> pip install silence
> ```

### 4. Configurar la base de datos

Abre `settings.py` y asegúrate de que los datos de conexión coinciden con tu MySQL local:

```python
DB_CONN = {
    "host": "127.0.0.1",
    "port": 3306,
    "username": "issi_user_gallery",
    "password": "1234",
    "database": "gallery",
}
```

Crea el usuario y la base de datos en MySQL si no existen:

```sql
CREATE DATABASE IF NOT EXISTS gallery;
CREATE USER IF NOT EXISTS 'issi_user_gallery'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON gallery.* TO 'issi_user_gallery'@'localhost';
FLUSH PRIVILEGES;
```

### 5. Crear las tablas y cargar datos de ejemplo

```bash
silence createdb
```

Este comando ejecuta en orden los scripts definidos en `SQL_SCRIPTS` dentro de `settings.py`:
1. `create_tables.sql` — crea las tablas.
2. `create_views.sql` — crea las vistas.
3. `populate_database.sql` — inserta datos de ejemplo.

### 6. Arrancar el servidor

```bash
silence run
```

El servidor se iniciará en `http://localhost:8080`. Abre esa URL en tu navegador para ver la galería.

### 7. Regenerar los ficheros JS de la API (si cambias los endpoints)

```bash
silence createapi
```

Esto regenera los ficheros `web/js/api/_*.js` a partir de los JSON de `endpoints/auto/`.

---

# Apuntes del proyecto

---

## 1. Cómo crear un proyecto desde cero con Silence

### ¿Qué es Silence?

**Silence** es un framework educativo creado por el grupo de investigación DEAL de la Universidad de Sevilla. Genera automáticamente una API REST a partir de definiciones JSON y sirve ficheros estáticos (HTML/CSS/JS) desde la carpeta `web/`. Usa Python + MySQL como backend.

### Crear un proyecto nuevo

```bash
silence new miproyecto
cd miproyecto
```

Esto genera la siguiente estructura base:

```
miproyecto/
├── settings.py
├── endpoints/
│   └── auto/
├── sql/
└── web/
    ├── css/
    ├── js/
    │   ├── api/
    │   ├── handlers/
    │   ├── renderers/
    │   ├── utils/
    │   └── libs/
    └── index.html
```

### El fichero `settings.py`

Es el fichero central de configuración. Los campos más importantes son:

| Campo | Descripción | Ejemplo |
|-------|------------|---------|
| `DEBUG_ENABLED` | Activa mensajes de depuración | `False` |
| `DB_CONN` | Datos de conexión a MySQL | `{"host": "127.0.0.1", "port": 3306, ...}` |
| `SQL_SCRIPTS` | Scripts SQL a ejecutar con `silence createdb` | `["create_tables.sql", ...]` |
| `HTTP_PORT` | Puerto del servidor web | `8080` |
| `API_PREFIX` | Prefijo de todas las rutas API | `"/api/efn"` |
| `USER_AUTH_DATA` | Tabla y campos para autenticación | `{"table": "Users", "identifier": "username", "password": "password"}` |
| `SECRET_KEY` | Clave secreta para tokens de sesión | `"JJEFNEFNEFNJJJJ"` |

### Definir endpoints (API REST)

Cada fichero `.json` en `endpoints/auto/` define las operaciones CRUD para una tabla. Ejemplo de `photos.json`:

```json
{
    "getAll": {
        "route": "/photos",
        "method": "GET",
        "sql": "SELECT * FROM photos",
        "auth_required": false
    },
    "getById": {
        "route": "/photos/$photoId",
        "method": "GET",
        "sql": "SELECT * FROM photos WHERE photoId = $photoId",
        "auth_required": false
    },
    "create": {
        "route": "/photos",
        "method": "POST",
        "sql": "INSERT INTO photos (title, description, url, visibility, userId) VALUES ($title, $description, $url, $visibility, $userId)",
        "request_body_params": ["title", "description", "url", "visibility", "userId"],
        "auth_required": true
    },
    "delete": {
        "route": "/photos/$photoId",
        "method": "DELETE",
        "sql": "DELETE FROM photos WHERE photoId = $photoId",
        "auth_required": true
    }
}
```

**Campos de cada endpoint:**

| Campo | Descripción |
|-------|------------|
| `route` | Ruta URL. Las variables empiezan por `$` (ej: `$photoId`) |
| `method` | Método HTTP: `GET`, `POST`, `PUT`, `DELETE` |
| `sql` | Consulta SQL a ejecutar. Usa `$variable` para parámetros |
| `request_body_params` | Parámetros que llegan en el body (solo POST/PUT) |
| `auth_required` | Si necesita token de sesión (`true`/`false`) |
| `allowed_roles` | Roles permitidos (`["*"]` = todos) |

Después de crear o modificar los JSON, ejecuta:

```bash
silence createapi
```

Esto genera automáticamente los ficheros JS cliente en `web/js/api/`.

### Definir la base de datos

Los scripts SQL van en la carpeta `sql/` y se ejecutan en el orden definido en `SQL_SCRIPTS`. Ejemplo de creación de tabla:

```sql
CREATE TABLE Users (
    userId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(128) NOT NULL,
    lastName VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    username VARCHAR(64) UNIQUE NOT NULL,
    password VARCHAR(256) NOT NULL
);
```

Puntos clave:
- `AUTO_INCREMENT` genera IDs automáticos.
- `UNIQUE` impide valores duplicados.
- `NOT NULL` hace el campo obligatorio.
- `FOREIGN KEY ... REFERENCES` establece relaciones entre tablas.
- `CHECK` añade restricciones de validación (ej: `CHECK (visibility IN ('Public', 'Private'))`).
- `ON DELETE CASCADE` borra registros hijos automáticamente al borrar el padre.

### Flujo de trabajo típico

1. Diseñar tablas → escribir `create_tables.sql`.
2. Crear vistas (si necesitas joins) → escribir `create_views.sql`.
3. Insertar datos de ejemplo → escribir `populate_database.sql`.
4. Ejecutar `silence createdb`.
5. Definir endpoints en `endpoints/auto/*.json`.
6. Ejecutar `silence createapi`.
7. Crear páginas HTML en `web/`.
8. Escribir JS para consumir la API y renderizar datos.
9. Ejecutar `silence run` y probar en el navegador.

---

## 2. Cómo escribir una página en HTML

### ¿Qué es HTML?

**HTML** (HyperText Markup Language) es el lenguaje de marcado que define la estructura y contenido de una página web. Se compone de **etiquetas** (tags) que rodean el contenido y le dan significado semántico.

### Estructura básica de un documento HTML

Todo documento HTML sigue esta estructura mínima:

```html
<!DOCTYPE html>
<html lang="es-ES" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Título de la página</title>
    <link rel="icon" href="images/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/style.css">
    <script src="js/libs/bootstrap.min.js"></script>
</head>
<body>
    <!-- Contenido visible -->
</body>
</html>
```

**Explicación línea a línea:**

1. `<!DOCTYPE html>` — Declara que es un documento HTML5.
2. `<html lang="es-ES" data-bs-theme="dark">` — Elemento raíz. `lang` indica el idioma. `data-bs-theme` activa el tema oscuro de Bootstrap.
3. `<head>` — Contiene metadatos, enlaces a CSS y scripts.
4. `<meta charset="UTF-8">` — Codificación de caracteres (soporta tildes, ñ, emojis).
5. `<meta name="viewport" ...>` — Hace la página responsive en móviles.
6. `<title>` — Título que aparece en la pestaña del navegador.
7. `<link rel="icon">` — Favicon (icono de la pestaña).
8. `<link rel="stylesheet">` — Enlaza hojas de estilo CSS externas.
9. `<script src="...">` — Enlaza ficheros JavaScript externos.
10. `<body>` — Todo el contenido visible de la página.

### Todas las etiquetas HTML usadas en este proyecto

#### Etiquetas de estructura y metadatos

| Etiqueta | Descripción | Atributos principales |
|----------|------------|----------------------|
| `<!DOCTYPE html>` | Declaración del tipo de documento (HTML5) | — |
| `<html>` | Elemento raíz del documento | `lang` (idioma), `data-bs-theme` (tema Bootstrap) |
| `<head>` | Contiene metadatos del documento | — |
| `<meta>` | Define metadatos | `charset` (codificación), `name` + `content` (viewport, etc.) |
| `<title>` | Título de la pestaña del navegador | — |
| `<link>` | Enlaza recursos externos | `rel` (relación), `href` (URL), `type` (tipo MIME) |
| `<script>` | Incluye o enlaza JavaScript | `src` (URL), `type` (ej: `"module"`), contenido inline |
| `<body>` | Contenido visible de la página | `class` (clases CSS) |

#### Etiquetas de contenido y semánticas

| Etiqueta | Descripción | Atributos principales |
|----------|------------|----------------------|
| `<main>` | Contenido principal de la página | `class` |
| `<nav>` | Barra de navegación | `class` |
| `<header>` / `<footer>` | Cabecera / pie de página | `class` |
| `<div>` | Contenedor genérico (bloque) | `id`, `class` |
| `<span>` | Contenedor genérico (línea) | `class` |
| `<h1>` a `<h6>` | Encabezados (del más grande al más pequeño) | `id`, `class` |
| `<p>` | Párrafo de texto | `class` |
| `<a>` | Enlace (hipervínculo) | `href` (URL destino), `class`, `role` |
| `<img>` | Imagen | `src` (URL), `alt` (texto alternativo), `class`, `style` |
| `<hr>` | Línea horizontal de separación | `class` |
| `<small>` | Texto pequeño | — |
| `<strong>` | Texto en negrita (semántico: importancia) | — |
| `<i>` | Texto en cursiva o icono (Font Awesome) | `class` (ej: `"fa fa-camera"`) |
| `<ul>` | Lista desordenada | `class` |
| `<li>` | Elemento de lista | `class` |

#### Etiquetas de formulario

| Etiqueta | Descripción | Atributos principales |
|----------|------------|----------------------|
| `<form>` | Contenedor de formulario | `id`, `novalidate` (desactiva validación nativa del navegador) |
| `<label>` | Etiqueta descriptiva de un campo | `for` (ID del input asociado), `class` |
| `<input>` | Campo de entrada | `type` (`text`, `email`, `password`, `url`), `id`, `name`, `placeholder`, `required`, `class` |
| `<textarea>` | Área de texto multilínea | `id`, `name`, `rows`, `placeholder`, `class` |
| `<select>` | Lista desplegable | `id`, `name`, `class` |
| `<option>` | Opción dentro de un `<select>` | `value`, `selected` |
| `<button>` | Botón | `type` (`submit`, `button`), `class`, `data-id` (atributo personalizado) |

#### Atributos importantes usados en el proyecto

| Atributo | Descripción | Ejemplo |
|----------|------------|---------|
| `id` | Identificador único del elemento | `id="gallery"` |
| `class` | Una o más clases CSS (separadas por espacios) | `class="btn btn-primary w-100"` |
| `href` | URL de destino de un enlace | `href="login.html"` |
| `src` | URL de origen de una imagen o script | `src="images/foto.jpg"` |
| `alt` | Texto alternativo para imágenes (accesibilidad) | `alt="Descripción"` |
| `type` | Tipo de input, botón o script | `type="password"`, `type="module"` |
| `name` | Nombre del campo (para enviar datos) | `name="username"` |
| `placeholder` | Texto de ayuda dentro de un campo vacío | `placeholder="Escribe aquí"` |
| `required` | Hace el campo obligatorio | `required` (sin valor) |
| `novalidate` | Desactiva la validación nativa del navegador | `novalidate` (sin valor) |
| `selected` | Marca una opción como seleccionada por defecto | `selected` |
| `value` | Valor del campo o de una opción | `value="Public"` |
| `data-*` | Atributos personalizados para almacenar datos | `data-id="5"`, `data-fallback="img.jpg"` |
| `aria-*` | Atributos de accesibilidad | `aria-label="Toggle navigation"`, `aria-expanded="false"` |
| `style` | Estilos CSS inline | `style="max-width:130px;"` |
| `data-bs-toggle` | Atributo de Bootstrap para activar componentes | `data-bs-toggle="collapse"`, `data-bs-toggle="dropdown"` |
| `data-bs-target` | Selector del elemento que se activa | `data-bs-target="#mainNav"` |
| `data-bs-dismiss` | Permite cerrar elementos de Bootstrap | `data-bs-dismiss="alert"` |

### Cómo estructurar correctamente una página web

Para que el código HTML esté **limpio y organizado**, sigue estas pautas (aplicadas en este proyecto):

#### 1. Un patrón consistente en todas las páginas

En este proyecto, todas las páginas siguen exactamente la misma estructura:

```html
<!DOCTYPE html>
<html lang="es-ES" data-bs-theme="dark">
<head>
    <!-- Meta, CSS, JS comunes -->
</head>
<body class="bg-dark text-light min-vh-100 d-flex flex-column">

    <!-- 1. Cabecera (incluida desde header.html) -->
    <div id="page-header"></div>

    <!-- 2. Contenido principal -->
    <main class="container py-4 flex-grow-1">
        <div id="errors"></div>
        <!-- Contenido específico de cada página -->
    </main>

    <!-- 3. Pie de página -->
    <footer class="bg-dark border-top border-secondary text-center py-3 mt-auto">
        <small class="text-secondary">&copy; 2025 Photo Gallery</small>
    </footer>

    <!-- 4. Scripts -->
    <script>include("header.html", "#page-header");</script>
    <script type="module" src="js/renderers/sessionNav.js"></script>
</body>
</html>
```

#### 2. Separar la cabecera en un fichero reutilizable

La cabecera de navegación (`header.html`) se escribe una sola vez y se incluye en todas las páginas usando una función JavaScript:

```html
<!-- En cada página -->
<div id="page-header"></div>
<script>include("header.html", "#page-header");</script>
```

Esto evita duplicar código y facilita el mantenimiento.

#### 3. Usar indentación consistente

- Cada nivel de anidamiento se indenta con **4 espacios** (o 1 tabulador).
- Las etiquetas de cierre están al mismo nivel que las de apertura.

#### 4. Separar estructura (HTML), estilo (CSS) y comportamiento (JS)

- **HTML:** Solo define la estructura y el contenido.
- **CSS:** Se escribe en ficheros `.css` separados (nunca inline, salvo excepciones).
- **JavaScript:** Se escribe en ficheros `.js` separados (nunca inline, salvo scripts de inclusión muy simples).

#### 5. Usar IDs para elementos únicos y clases para estilos repetibles

- `id="gallery"` → Hay un solo contenedor de galería en la página.
- `class="gallery-card"` → Muchas tarjetas comparten esta clase.

#### 6. Agrupar lógicamente con divs y clases de Bootstrap

```html
<div class="row g-4">           <!-- Fila de la cuadrícula -->
    <div class="col-md-6 col-lg-4">  <!-- Columna responsive -->
        <div class="card">      <!-- Tarjeta -->
            <!-- Contenido -->
        </div>
    </div>
</div>
```

#### 7. Usar comentarios para secciones importantes

```html
<!-- Photo gallery grid rendered by JS; fallback static cards below -->
<div id="gallery" class="row g-4">
    ...
</div>
```

#### 8. Colocar los scripts al final del `<body>`

Los scripts se ponen justo antes de `</body>` para que el HTML se cargue primero y el usuario vea contenido lo antes posible.

---

## 3. Cómo implementar estilos con CSS

### ¿Qué es CSS?

**CSS** (Cascading Style Sheets) es el lenguaje que define la apariencia visual de los elementos HTML: colores, tamaños, espaciados, animaciones, disposición, etc.

### Cómo escribir CSS: selectores y formas de aplicar estilos

#### Las tres formas de aplicar CSS

**1. CSS externo** (recomendado — usado en este proyecto):

Se escribe en un fichero `.css` separado y se enlaza en el HTML:

```html
<link rel="stylesheet" href="css/style.css">
```

**2. CSS interno** (dentro de la etiqueta `<style>` en el HTML):

```html
<style>
    h1 { color: red; }
</style>
```

**3. CSS inline** (directamente en el atributo `style` del elemento):

```html
<div style="max-width: 130px;">...</div>
```

> En este proyecto se usa principalmente CSS externo. El inline solo se usa en casos muy puntuales (como ajustar el ancho de un `<select>`).

#### Tipos de selectores CSS

Los selectores determinan **a qué elementos** se aplican las reglas:

**1. Selector de etiqueta** — Afecta a TODOS los elementos de ese tipo:

```css
main {
    animation: fadeIn .4s ease both;
}
```
Esto aplica una animación a **todos** los `<main>` de la página.

**2. Selector de clase** (`.nombre`) — Afecta a todos los elementos con esa clase:

```css
.fade-in-up {
    animation: fadeInUp .6s ease both;
}
```
Se aplica a cualquier elemento con `class="fade-in-up"`.

**3. Selector de ID** (`#nombre`) — Afecta a UN solo elemento con ese ID:

```css
#title {
    font-size: 2.5rem;
    color: #e0e0e0;
}
```

**4. Selector descendente** (espacio) — Afecta a un elemento dentro de otro:

```css
.gallery-card .card {
    transition: transform .25s ease, box-shadow .25s ease;
}
```
Esto solo afecta a los `.card` que están **dentro** de un `.gallery-card`.

**5. Pseudo-clases** (`:hover`, `:nth-child()`) — Afectan a un estado o posición:

```css
.gallery-card .card:hover {
    transform: translateY(-6px);
    box-shadow: 0 .75rem 1.5rem rgba(0,0,0,.45);
}

.gallery-card:nth-child(1) { animation-delay: .05s; }
.gallery-card:nth-child(2) { animation-delay: .10s; }
```

**6. Selector de atributo** — Afecta a elementos con un atributo específico:

```css
/* Ejemplo: img[data-fallback] afectaría a imágenes con ese atributo */
```

#### Prioridad de los selectores (Especificidad)

Cuando dos reglas afectan al mismo elemento, gana la más específica:

1. `!important` (máxima prioridad, evitar en lo posible).
2. Estilos inline (`style="..."`).
3. Selector de ID (`#titulo`).
4. Selector de clase (`.clase`), pseudo-clase (`:hover`), atributo (`[type]`).
5. Selector de etiqueta (`div`, `main`, `p`).

### Propiedades CSS responsivas y animaciones

#### Diseño responsivo

El diseño responsivo hace que la web se adapte a cualquier tamaño de pantalla. En este proyecto se consigue combinando Bootstrap (sistema de grid) con propiedades CSS nativas.

**Propiedad `object-fit`** — Controla cómo se ajusta una imagen dentro de su contenedor:

```css
.photo-img {
    width: 100%;
    height: 220px;
    object-fit: cover;  /* Recorta para llenar sin deformar */
}
```

Valores de `object-fit`:
| Valor | Comportamiento |
|-------|---------------|
| `fill` | Estira la imagen (puede deformar) |
| `contain` | Ajusta sin recortar (puede dejar espacios) |
| `cover` | Rellena sin deformar (recorta lo que sobre) ← **usado aquí** |
| `none` | Tamaño original |

**Propiedad `max-width`** — Limita el ancho máximo de un elemento:

```css
.auth-card {
    max-width: 480px;
    margin: 0 auto;  /* Centra horizontalmente */
}
```

**Unidades relativas usadas:**
| Unidad | Significado | Ejemplo |
|--------|-----------|---------|
| `rem` | Relativa al tamaño de fuente raíz (16px por defecto) | `2.5rem` = 40px |
| `%` | Porcentaje del contenedor padre | `width: 100%` |
| `vh` | Porcentaje de la altura de la ventana | `min-height: 100vh` |
| `px` | Píxeles (absoluta) | `height: 220px` |
| `s` | Segundos (para animaciones) | `0.6s` |

#### Animaciones CSS (`@keyframes`)

Las animaciones se definen en dos pasos:

**Paso 1: Definir la animación** con `@keyframes`:

```css
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

- `from` = estado inicial (0%).
- `to` = estado final (100%).
- Se pueden usar porcentajes intermedios:

```css
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.04); }
}
```

**Paso 2: Aplicar la animación** a un elemento:

```css
.fade-in-up {
    animation: fadeInUp .6s ease both;
}
```

**Propiedad `animation` abreviada:**

```
animation: nombre duración función-timing modo-relleno;
```

| Parte | Descripción | Ejemplo |
|-------|------------|---------|
| `nombre` | Nombre de la animación definida en `@keyframes` | `fadeInUp` |
| `duración` | Cuánto dura la animación | `.6s` |
| `función-timing` | Curva de velocidad | `ease` (lenta→rápida→lenta) |
| `modo-relleno` | Qué estilo se mantiene al acabar | `both` (mantiene el estilo final) |

**Todas las animaciones definidas en este proyecto:**

```css
/* Aparece desde abajo con desvanecimiento */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* Simple desvanecimiento */
@keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}

/* Entra desde la izquierda */
@keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0); }
}

/* Efecto de pulsación (crece y vuelve) */
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.04); }
}
```

**Clases de animación para usar en HTML:**

```css
.fade-in-up   { animation: fadeInUp .6s ease both; }
.fade-in       { animation: fadeIn .5s ease both; }
.slide-in-left { animation: slideInLeft .5s ease both; }
```

#### Efecto stagger (escalonado) en tarjetas

Para que las tarjetas aparezcan una después de otra, se usa `animation-delay`:

```css
.gallery-card:nth-child(1)  { animation-delay: .05s; }
.gallery-card:nth-child(2)  { animation-delay: .10s; }
.gallery-card:nth-child(3)  { animation-delay: .15s; }
/* ... hasta la tarjeta 10 */
```

Cada tarjeta espera un poco más que la anterior antes de empezar su animación.

#### Transiciones CSS

Las transiciones son animaciones simples que se activan al cambiar un estado (ej: hover):

```css
.gallery-card .card {
    transition: transform .25s ease, box-shadow .25s ease;
}
.gallery-card .card:hover {
    transform: translateY(-6px);
    box-shadow: 0 .75rem 1.5rem rgba(0,0,0,.45);
}
```

**Propiedad `transition`:**
```
transition: propiedad duración función-timing;
```

- Se pueden transicionar múltiples propiedades separándolas con comas.
- Solo se animan propiedades que cambien (aquí `transform` y `box-shadow`).

**`transform`** — Transformaciones 2D/3D:

| Función | Qué hace | Ejemplo |
|---------|---------|---------|
| `translateY(-6px)` | Mueve el elemento hacia arriba 6px | Efecto hover en tarjetas |
| `translateX(-40px)` | Mueve el elemento a la izquierda 40px | Animación slideInLeft |
| `scale(1.04)` | Aumenta el tamaño un 4% | Animación pulse |

**`box-shadow`** — Sombra del elemento:
```css
box-shadow: desplazamiento-x desplazamiento-y difuminado color;
/* Ejemplo: */
box-shadow: 0 .75rem 1.5rem rgba(0,0,0,.45);
```

#### Glow en la marca de navegación

```css
.navbar-brand {
    transition: text-shadow .3s ease;
}
.navbar-brand:hover {
    text-shadow: 0 0 8px rgba(13,110,253,.6);
}
```

`text-shadow` funciona igual que `box-shadow` pero para texto.

### Cómo usar Bootstrap en profundidad

#### ¿Qué es Bootstrap?

**Bootstrap** es un framework CSS que proporciona clases predefinidas para construir interfaces profesionales rápidamente. En este proyecto se usa **Bootstrap 5** con el **tema oscuro** (`data-bs-theme="dark"`).

Se incluye así:

```html
<link rel="stylesheet" href="css/bootstrap.min.css">
<script src="js/libs/bootstrap.min.js"></script>
```

#### Sistema de Grid (cuadrícula)

Bootstrap divide la pantalla en **12 columnas**. Se usa con las clases `row` y `col-*`:

```html
<div class="row g-4">
    <div class="col-md-6 col-lg-4">Tarjeta 1</div>
    <div class="col-md-6 col-lg-4">Tarjeta 2</div>
    <div class="col-md-6 col-lg-4">Tarjeta 3</div>
</div>
```

**Breakpoints (puntos de corte):**

| Clase | Ancho mínimo | Ejemplo de uso |
|-------|-------------|----------------|
| `col-` | 0px (siempre) | Móviles pequeños |
| `col-sm-` | 576px | Móviles grandes |
| `col-md-` | 768px | Tabletas |
| `col-lg-` | 992px | Escritorio |
| `col-xl-` | 1200px | Escritorio grande |

**Ejemplo del proyecto:**
- `col-md-6 col-lg-4` → En tableta: 2 tarjetas por fila (6+6=12). En escritorio: 3 tarjetas por fila (4+4+4=12).
- `col-md-3` → Columna lateral que ocupa 3/12 = 25% del ancho.

**`g-4`** → Gap (espacio) entre columnas de tamaño 4 (1.5rem).

#### Clases de utilidad (las más usadas en el proyecto)

**Espaciado (margin `m` y padding `p`):**

| Clase | Significado |
|-------|------------|
| `m-0` a `m-5` | Margin en todas las direcciones (0 a 3rem) |
| `mt-4` | Margin-top nivel 4 (1.5rem) |
| `mb-3` | Margin-bottom nivel 3 (1rem) |
| `me-2` | Margin-end (derecha en LTR) nivel 2 (0.5rem) |
| `ms-1` | Margin-start (izquierda) nivel 1 (0.25rem) |
| `p-4` | Padding en todas las direcciones |
| `py-4` | Padding vertical (top + bottom) |
| `px-3` | Padding horizontal (left + right) |
| `mb-0` | Margin-bottom 0 |

**Tipografía:**

| Clase | Efecto |
|-------|--------|
| `fw-bold` | Font-weight bold |
| `fw-semibold` | Font-weight semi-bold |
| `fs-6` | Font-size nivel 6 (pequeño) |
| `text-center` | Centrar texto |
| `text-end` | Texto alineado a la derecha |
| `text-light` | Color de texto claro |
| `text-secondary` | Color de texto gris/secundario |
| `text-warning` | Color de texto amarillo/advertencia |
| `text-decoration-none` | Quitar subrayado de enlaces |

**Colores de fondo:**

| Clase | Color |
|-------|-------|
| `bg-dark` | Fondo oscuro |
| `bg-primary` | Azul |
| `bg-secondary` | Gris |
| `bg-success` | Verde |
| `bg-danger` | Rojo |
| `bg-info` | Azul claro |
| `bg-warning` | Amarillo |

**Bordes:**

| Clase | Efecto |
|-------|--------|
| `border-secondary` | Borde color gris |
| `border-top` | Solo borde superior |
| `border-bottom` | Solo borde inferior |
| `rounded` | Bordes redondeados |
| `rounded-circle` | Totalmente circular |

**Display y Flexbox:**

| Clase | Efecto |
|-------|--------|
| `d-flex` | Display flex |
| `d-grid` | Display grid |
| `d-none` | Display none (ocultar) |
| `flex-column` | Dirección flex en columna |
| `flex-grow-1` | El elemento crece para llenar espacio |
| `justify-content-between` | Espacio entre elementos |
| `justify-content-center` | Centrar en el eje principal |
| `align-items-center` | Centrar en el eje transversal |
| `gap-2` | Espacio entre hijos flex (0.5rem) |

**Tamaños:**

| Clase | Efecto |
|-------|--------|
| `w-100` | Width 100% |
| `h-100` | Height 100% |
| `min-vh-100` | Mínimo 100% de la altura de ventana |

#### Componentes de Bootstrap usados en el proyecto

**1. Navbar (barra de navegación)**

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
    <div class="container-fluid">
        <a class="navbar-brand fw-semibold" href="index.html">
            <i class="fa fa-camera me-1"></i> Gallery
        </a>
        <button class="navbar-toggler" type="button"
                data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link" href="index.html">Home</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
```

Clases clave:
- `navbar-expand-lg` → Se expande a partir de `lg` (992px), en móvil muestra hamburguesa.
- `sticky-top` → La navbar se fija arriba al hacer scroll.
- `navbar-toggler` + `data-bs-toggle="collapse"` → Botón hamburguesa que abre/cierra el menú.
- `collapse navbar-collapse` → El contenido que se oculta/muestra en móvil.
- `navbar-nav me-auto` → Lista de enlaces que empuja el resto a la derecha.

**2. Dropdown (menú desplegable)**

```html
<li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" role="button"
       data-bs-toggle="dropdown" aria-expanded="false">
        Trending
    </a>
    <ul class="dropdown-menu dropdown-menu-dark">
        <li><a class="dropdown-item" href="trending_photos.html">Photos</a></li>
        <li><a class="dropdown-item" href="trending_users.html">Users</a></li>
    </ul>
</li>
```

- `dropdown-toggle` + `data-bs-toggle="dropdown"` → Activa el desplegable al hacer clic.
- `dropdown-menu-dark` → Estilo oscuro para el menú.

**3. Cards (tarjetas)**

```html
<div class="card bg-dark border-secondary h-100">
    <img src="foto.jpg" class="card-img-top photo-img" alt="...">
    <div class="card-body">
        <h5 class="card-title">Título</h5>
        <p class="card-text text-secondary">Descripción</p>
    </div>
    <div class="card-footer border-secondary d-flex gap-2">
        <button class="btn btn-sm btn-outline-warning flex-grow-1">Edit</button>
        <button class="btn btn-sm btn-outline-danger flex-grow-1">Delete</button>
    </div>
</div>
```

- `card` → Contenedor base.
- `card-img-top` → Imagen en la parte superior.
- `card-body` → Zona de contenido con padding.
- `card-title` / `card-text` → Título y texto.
- `card-footer` → Pie de la tarjeta.
- `h-100` → La tarjeta ocupa el 100% de la altura de su columna.

**4. Buttons (botones)**

| Clase | Estilo |
|-------|--------|
| `btn btn-primary` | Botón azul sólido |
| `btn btn-success` | Botón verde sólido |
| `btn btn-danger` | Botón rojo sólido |
| `btn btn-outline-primary` | Botón con borde azul, fondo transparente |
| `btn btn-outline-warning` | Botón con borde amarillo |
| `btn btn-outline-danger` | Botón con borde rojo |
| `btn btn-sm` | Botón pequeño |
| `btn w-100` | Botón que ocupa el 100% del ancho |

**5. Alerts (alertas)**

```html
<div class="alert alert-danger alert-dismissible fade show">
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    Mensaje de error
</div>
```

- `alert-danger` (rojo), `alert-success` (verde), `alert-warning` (amarillo).
- `alert-dismissible` + `btn-close` + `data-bs-dismiss="alert"` → Permite cerrar la alerta.

**6. Badges (insignias)**

```html
<span class="badge bg-primary">Public</span>
<span class="badge bg-success fs-6 badge-score">+3</span>
```

**7. Formularios**

```html
<div class="mb-3">
    <label for="username-input" class="form-label">Username</label>
    <div class="input-group">
        <span class="input-group-text bg-secondary border-secondary">
            <i class="fa fa-user"></i>
        </span>
        <input type="text" class="form-control bg-dark text-light border-secondary"
               id="username-input" name="username" placeholder="Username" required>
    </div>
</div>
```

- `form-label` → Estilo de etiqueta.
- `form-control` → Estilo de input/textarea.
- `form-select` → Estilo de select.
- `input-group` + `input-group-text` → Icono pegado al input.

**8. List group (lista agrupada)**

```html
<ul class="list-group list-group-flush">
    <li class="list-group-item bg-dark text-light border-secondary">
        <strong>agu</strong> <small class="text-secondary">fecha</small>
        <p class="mb-0 mt-1">Comentario</p>
    </li>
</ul>
```

- `list-group-flush` → Sin bordes laterales.

#### Cómo organizar las clases en HTML con Bootstrap

Para mantener el HTML limpio y profesional:

1. **Orden de clases recomendado:** Componente → Variante de color → Espaciado → Utilidades de display → Otras.

```html
<!-- Componente → Color → Espaciado → Display/Tamaño -->
<button class="btn btn-outline-warning btn-sm flex-grow-1">
```

2. **Usar el sistema de grid para el layout general** y flexbox para alinear elementos dentro:

```html
<div class="row g-4">
    <div class="col-md-6 col-lg-4">...</div>
</div>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>Título</h2>
    <a class="btn btn-outline-primary" href="#">Acción</a>
</div>
```

3. **Sticky footer** (footer siempre abajo) con flexbox:

```html
<body class="d-flex flex-column min-vh-100">
    <main class="flex-grow-1">...</main>
    <footer class="mt-auto">...</footer>
</body>
```

4. **Tema consistente** aplicando las mismas clases de color en todas las páginas:
   - Fondo: `bg-dark`
   - Texto: `text-light`
   - Bordes: `border-secondary`
   - Inputs: `bg-dark text-light border-secondary`

#### Font Awesome (iconos)

Font Awesome proporciona iconos mediante la etiqueta `<i>` con clases:

```html
<i class="fa fa-camera me-1"></i>    <!-- Cámara -->
<i class="fa fa-user me-1"></i>      <!-- Usuario -->
<i class="fa fa-sign-in me-1"></i>   <!-- Iniciar sesión -->
<i class="fa fa-trash me-1"></i>     <!-- Papelera -->
<i class="fa fa-pencil me-1"></i>    <!-- Lápiz (editar) -->
<i class="fa fa-plus me-1"></i>      <!-- Símbolo + -->
<i class="fa fa-upload me-1"></i>    <!-- Subir -->
<i class="fa fa-home me-1"></i>      <!-- Casa -->
<i class="fa fa-fire me-1"></i>      <!-- Fuego (trending) -->
<i class="fa fa-star me-1"></i>      <!-- Estrella -->
<i class="fa fa-tags me-1"></i>      <!-- Etiquetas -->
<i class="fa fa-thumbs-up me-1"></i> <!-- Pulgar arriba -->
<i class="fa fa-comments me-1"></i>  <!-- Comentarios -->
<i class="fa fa-picture-o me-1"></i> <!-- Imagen -->
<i class="fa fa-lock me-1"></i>      <!-- Candado -->
<i class="fa fa-globe me-1"></i>     <!-- Globo (público) -->
<i class="fa fa-envelope me-1"></i>  <!-- Sobre (email) -->
<i class="fa fa-link me-1"></i>      <!-- Enlace -->
<i class="fa fa-arrow-left me-1"></i><!-- Flecha izquierda -->
<i class="fa fa-check me-1"></i>     <!-- Marca de verificación -->
<i class="fa fa-sign-out me-1"></i>  <!-- Cerrar sesión -->
<i class="fa fa-cloud-upload me-1"></i> <!-- Subir a la nube -->
<i class="fa fa-user-plus me-1"></i> <!-- Registrarse -->
```

El patrón es: `fa` (clase base) + `fa-nombre` (icono) + `me-1` (margen derecho para separar del texto).

---

## 4. Cómo usar JavaScript

### ¿Qué es JavaScript?

**JavaScript** es el lenguaje de programación que se ejecuta en el navegador y permite:
- Manipular el contenido de la página (DOM).
- Responder a eventos del usuario (clics, envíos de formulario).
- Comunicarse con el servidor (peticiones HTTP asíncronas).
- Almacenar datos en el navegador (`localStorage`).

### Conceptos fundamentales de JavaScript

#### Variables y constantes

```javascript
let nombre = "Agustín";     // Variable que puede cambiar
const PI = 3.14159;          // Constante que NO puede cambiar
```

- Usar `let` para variables que cambian.
- Usar `const` para valores fijos.
- **Nunca** usar `var` (es antiguo y tiene problemas de alcance).

#### Tipos de datos

| Tipo | Ejemplo |
|------|---------|
| `string` | `"Hola"`, `'mundo'`, `` `template ${var}` `` |
| `number` | `42`, `3.14` |
| `boolean` | `true`, `false` |
| `null` | `null` (ausencia intencional de valor) |
| `undefined` | `undefined` (variable sin asignar) |
| `object` | `{ nombre: "Ana", edad: 25 }` |
| `array` | `[1, 2, 3]` |

#### Template literals (cadenas con interpolación)

En lugar de concatenar con `+`, se usan backticks:

```javascript
let nombre = "Ana";
let saludo = `Hola, ${nombre}!`;  // "Hola, Ana!"
```

Esto se usa extensivamente en este proyecto para generar HTML dinámico:

```javascript
return `<div class="card">
    <h5>${photo.title}</h5>
    <p>${photo.description}</p>
</div>`;
```

#### Operadores

**Comparación:**
| Operador | Significado |
|----------|-----------|
| `===` | Igual estricto (valor y tipo) |
| `!==` | Diferente estricto |
| `>`, `<`, `>=`, `<=` | Mayor, menor, etc. |

**Lógicos:**
| Operador | Significado |
|----------|-----------|
| `&&` | Y (ambos verdaderos) |
| `\|\|` | O (al menos uno verdadero) |
| `!` | Negación |

**Operador ternario:**
```javascript
let clase = photo.visibility === 'Public' ? 'primary' : 'secondary';
```
Equivale a: "Si es Public, usa 'primary'; si no, usa 'secondary'".

#### Condicionales

```javascript
if (condición) {
    // se ejecuta si es verdadero
} else if (otraCondición) {
    // otra comprobación
} else {
    // si ninguna se cumple
}
```

#### Bucles

```javascript
// For clásico
for (let i = 0; i < array.length; i++) { ... }

// forEach (más moderno)
array.forEach(function(elemento) { ... });

// forEach con arrow function
array.forEach(elemento => { ... });
```

#### Funciones

**Función clásica:**
```javascript
function sumar(a, b) {
    return a + b;
}
```

**Arrow function (función flecha):**
```javascript
const sumar = (a, b) => a + b;

// Con cuerpo de bloque:
const procesar = (dato) => {
    let resultado = dato * 2;
    return resultado;
};
```

**Función anónima:**
```javascript
document.addEventListener("click", function() {
    console.log("Click!");
});
```

#### Objetos

```javascript
let usuario = {
    nombre: "Ana",
    edad: 25,
    saludar: function() {
        return `Hola, soy ${this.nombre}`;
    }
};

console.log(usuario.nombre);     // "Ana"
console.log(usuario.saludar());  // "Hola, soy Ana"
```

En este proyecto, los módulos como `sessionManager` y `messageRenderer` son objetos con métodos:

```javascript
const sessionManager = {
    login: function(token, userData) { ... },
    logout: function() { ... },
    isLogged: function() { ... },
    getLoggedUser: function() { ... },
};
```

#### Arrays y sus métodos

```javascript
let numeros = [1, 2, 3, 4, 5];

// map: transforma cada elemento
let dobles = numeros.map(n => n * 2);  // [2, 4, 6, 8, 10]

// filter: filtra elementos
let pares = numeros.filter(n => n % 2 === 0);  // [2, 4]

// join: une elementos en un string
let texto = ["a", "b", "c"].join(", ");  // "a, b, c"

// forEach: itera sin devolver resultado
numeros.forEach(n => console.log(n));
```

En el proyecto, `map` + `join` se usa para generar el HTML de las tarjetas:

```javascript
gallery.innerHTML = photos.map((p, i) => renderPhotoCard(p, i)).join('');
```

#### Destructuring (desestructuración)

```javascript
// Objeto
let { nombre, edad } = { nombre: "Ana", edad: 25 };

// Parámetros de función (usado en el proyecto)
let formData = { firstName, lastName, email, username, password };
// Es equivalente a:
let formData = { firstName: firstName, lastName: lastName, ... };
```

Cuando el nombre de la variable coincide con la clave del objeto, se puede abreviar.

### El DOM (Document Object Model)

El DOM es la representación del HTML como un árbol de objetos que JavaScript puede manipular.

#### Seleccionar elementos

```javascript
// Por ID (devuelve UN elemento)
let gallery = document.getElementById("gallery");

// Por selector CSS (devuelve UN elemento, el primero que coincide)
let img = document.querySelector("main img.img-fluid");

// Por selector CSS (devuelve TODOS los elementos que coinciden)
let botones = document.querySelectorAll(".btn-delete");
```

#### Modificar elementos

```javascript
// Cambiar contenido HTML
elemento.innerHTML = "<p>Nuevo contenido</p>";

// Cambiar solo texto (más seguro contra XSS)
elemento.textContent = "Texto plano";

// Cambiar atributos
img.src = "nueva-imagen.jpg";
img.alt = "Descripción";

// Cambiar clases
elemento.classList.add("d-none");     // Añadir clase
elemento.classList.remove("d-none");  // Quitar clase

// Leer atributos
let id = boton.getAttribute("data-id");
```

#### Crear elementos

```javascript
let texto = document.createTextNode("Hola mundo");
elemento.appendChild(texto);
```

#### Eventos

```javascript
// Añadir un event listener
boton.addEventListener("click", function() {
    alert("¡Clic!");
});

// Evento submit de formulario
form.addEventListener("submit", function(event) {
    event.preventDefault();  // Evita que el formulario recargue la página
    // Procesar datos...
});

// Evento DOMContentLoaded (cuando el HTML se ha cargado)
document.addEventListener("DOMContentLoaded", function() {
    // Inicializar la página
});

// Evento de error en imagen
img.addEventListener("error", function() {
    this.src = "placeholder.jpg";
});
```

`event.preventDefault()` es muy importante: evita el comportamiento por defecto del navegador (ej: que un formulario recargue la página al enviarse).

### Programación asíncrona: `async` / `await`

La comunicación con el servidor es **asíncrona** (no bloquea la página mientras espera respuesta).

#### Promesas

Una **promesa** representa un valor que estará disponible en el futuro. Se usa con `then/catch` o, más modernamente, con `async/await`.

#### `async` / `await`

```javascript
async function cargarFotos() {
    try {
        let fotos = await photosAPI_auto.getAll();  // Espera a que la API responda
        // Usar los datos...
    } catch (err) {
        // Manejar el error
        console.error("Error al cargar fotos", err);
    }
}
```

- `async` → Marca la función como asíncrona (puede usar `await`).
- `await` → Pausa la ejecución hasta que la promesa se resuelva.
- `try/catch` → Captura errores si la petición falla.

### Módulos ES6 (`import` / `export`)

Los módulos permiten dividir el código en ficheros independientes.

#### Exportar

```javascript
// session.js
const sessionManager = { ... };
export { sessionManager };
```

#### Importar

```javascript
// login.js
import { sessionManager } from '../utils/session.js';
```

Para que funcione, el script debe cargarse como módulo:

```html
<script type="module" src="js/handlers/login.js"></script>
```

> `type="module"` es obligatorio. Sin él, `import`/`export` no funcionan.

### Uso de `'use strict'`

```javascript
'use strict';
```

Al inicio de cada fichero, activa el **modo estricto** de JavaScript:
- Obliga a declarar variables (evita errores por typos).
- Prohíbe algunas funciones inseguras.
- Hace que los errores sean más fáciles de detectar.

### `localStorage` (almacenamiento en el navegador)

`localStorage` permite guardar datos en el navegador del usuario de forma persistente (sobrevive al cierre del navegador).

```javascript
// Guardar
localStorage.setItem("clave", "valor");

// Leer
let valor = localStorage.getItem("clave");

// Borrar uno
localStorage.removeItem("clave");

// Para guardar objetos, usar JSON:
localStorage.setItem("usuario", JSON.stringify({ nombre: "Ana", id: 1 }));
let usuario = JSON.parse(localStorage.getItem("usuario"));
```

En el proyecto se usa para la gestión de sesiones:

```javascript
const sessionManager = {
    login: function(sessionToken, userData) {
        localStorage.setItem("sessionToken", sessionToken);
        localStorage.setItem("sessionTokenTime", new Date().getTime());
        localStorage.setItem("loggedUserData", JSON.stringify(userData));
    },
    logout: function() {
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("sessionTokenTime");
        localStorage.removeItem("loggedUserData");
    },
    getToken: function() {
        let token = localStorage.getItem("sessionToken");
        // Comprobar si ha expirado...
        return token;
    },
    isLogged: function() {
        return this.getToken() !== null;
    },
    getLoggedUser: function() {
        return JSON.parse(localStorage.getItem("loggedUserData"));
    }
};
```

### Peticiones HTTP con Axios

**Axios** es una librería para hacer peticiones HTTP desde JavaScript. Se incluye como fichero estático:

```html
<script src="js/libs/axios.min.js"></script>
```

#### Configuración base (common.js)

```javascript
import { sessionManager } from '../utils/session.js';

const BASE_URL = "/api/v1";

const requestOptions = {
    headers: { Token: sessionManager.getToken() },
};

export { BASE_URL, requestOptions };
```

- `BASE_URL` → Prefijo común de todas las rutas API.
- `requestOptions` → Headers que se envían en cada petición (incluyendo el token de sesión).

#### Hacer peticiones

```javascript
// GET (obtener datos)
let response = await axios.get(`${BASE_URL}/photos`, requestOptions);
let datos = response.data;

// GET con parámetro en URL
let response = await axios.get(`${BASE_URL}/photos/${photoId}`, requestOptions);

// POST (crear datos)
let response = await axios.post(`${BASE_URL}/photos`, formData, requestOptions);

// PUT (actualizar datos)
let response = await axios.put(`${BASE_URL}/photos/${photoId}`, formData, requestOptions);

// DELETE (borrar datos)
let response = await axios.delete(`${BASE_URL}/photos/${photoId}`, requestOptions);
```

#### Ficheros de API autogenerados

Silence genera automáticamente ficheros como `_photos.js`:

```javascript
const photosAPI_auto = {
    getAll: async function() {
        let response = await axios.get(`${BASE_URL}/photos`, requestOptions);
        return response.data;
    },
    getById: async function(photoId) {
        let response = await axios.get(`${BASE_URL}/photos/${photoId}`, requestOptions);
        return response.data[0];
    },
    create: async function(formData) {
        let response = await axios.post(`${BASE_URL}/photos`, formData, requestOptions);
        return response.data;
    },
    delete: async function(photoId) {
        let response = await axios.delete(`${BASE_URL}/photos/${photoId}`, requestOptions);
        return response.data;
    },
};
export { photosAPI_auto };
```

### Patrón completo: de la página al servidor

A continuación se explica el flujo completo de cómo funciona cada parte del proyecto, con ejemplos reales.

#### Ejemplo 1: Renderizar la galería de fotos (photos.js)

```javascript
'use strict';

import { photosAPI_auto } from '../api/_photos.js';
import { messageRenderer } from './messages.js';
import { sessionManager } from '../utils/session.js';

// 1. Generar el HTML de una tarjeta de foto
function renderPhotoCard(photo, index) {
    let isOwner = sessionManager.isLogged() &&
                  sessionManager.getLoggedId() === photo.userId;

    let editButtons = isOwner
        ? `<div class="card-footer border-secondary d-flex gap-2">
               <button class="btn btn-sm btn-outline-warning flex-grow-1 btn-edit"
                       data-id="${photo.photoId}">Edit</button>
               <button class="btn btn-sm btn-outline-danger flex-grow-1 btn-delete"
                       data-id="${photo.photoId}">Delete</button>
           </div>`
        : '';

    return `
        <div class="col-md-6 col-lg-4 gallery-card fade-in-up"
             style="animation-delay:${index * 0.07}s">
            <div class="card bg-dark border-secondary h-100">
                <a href="photo_detail.html?img=${encodeURIComponent(photo.url)}&title=${encodeURIComponent(photo.title)}">
                    <img src="${photo.url}" class="card-img-top photo-img"
                         alt="${photo.title}" data-fallback="images/placeholder-img.jpg">
                </a>
                <div class="card-body">
                    <h5 class="card-title">${photo.title}</h5>
                    <p class="card-text text-secondary">${photo.description || ''}</p>
                </div>
                ${editButtons}
            </div>
        </div>`;
}

// 2. Cargar fotos de la API e inyectarlas en el DOM
async function loadPhotos() {
    let gallery = document.getElementById("gallery");
    if (!gallery) return;

    try {
        let photos = await photosAPI_auto.getAll();
        if (photos && photos.length > 0) {
            gallery.innerHTML = photos.map((p, i) => renderPhotoCard(p, i)).join('');
            attachDeleteHandlers();
            attachImageFallbacks();
        }
    } catch (err) {
        console.warn("API not available, showing static fallback cards.", err);
    }
}

// 3. Añadir event listeners a los botones de borrar
function attachDeleteHandlers() {
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", async function() {
            let photoId = this.getAttribute("data-id");
            if (confirm("Are you sure?")) {
                try {
                    await photosAPI_auto.delete(photoId);
                    loadPhotos();  // Recargar la galería
                } catch (err) {
                    messageRenderer.showErrorMessage("Could not delete the photo.");
                }
            }
        });
    });
}

// 4. Fallback: si la imagen no carga, mostrar un placeholder
function attachImageFallbacks() {
    document.querySelectorAll("img[data-fallback]").forEach(img => {
        img.addEventListener("error", function() {
            this.src = this.getAttribute("data-fallback");
        });
    });
}

// 5. Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", loadPhotos);
```

#### Ejemplo 2: Manejar el login (login.js)

```javascript
'use strict';

import { authAPI_auto } from '../api/_auth.js';
import { sessionManager } from '../utils/session.js';
import { messageRenderer } from '../renderers/messages.js';

function handleLogin() {
    let form = document.getElementById("login-form");
    if (!form) return;

    form.addEventListener("submit", async function(event) {
        event.preventDefault();  // Evitar recarga de página

        // 1. Leer valores del formulario
        let username = document.getElementById("username-input").value.trim();
        let password = document.getElementById("password-input").value;

        // 2. Validar en el cliente
        if (!username || !password) {
            messageRenderer.showErrorMessage("Please fill in all fields.");
            return;
        }

        // 3. Enviar al servidor
        try {
            let response = await authAPI_auto.login({ username, password });
            // 4. Guardar sesión y redirigir
            sessionManager.login(response.sessionToken, response.user);
            window.location.href = "index.html";
        } catch (err) {
            messageRenderer.showErrorMessage("Incorrect username or password.");
        }
    });
}

document.addEventListener("DOMContentLoaded", handleLogin);
```

#### Ejemplo 3: Navegación según sesión (sessionNav.js)

```javascript
'use strict';

import { sessionManager } from '../utils/session.js';

function updateSessionNav() {
    let loggedOut = document.getElementById("nav-logged-out");
    let loggedIn  = document.getElementById("nav-logged-in");

    if (sessionManager.isLogged()) {
        loggedOut.classList.add("d-none");     // Ocultar Register/Login
        loggedIn.classList.remove("d-none");   // Mostrar Upload/Logout
        let user = sessionManager.getLoggedUser();
        document.getElementById("nav-username").innerHTML =
            `<i class="fa fa-user me-1"></i>${user.username}`;
    } else {
        loggedOut.classList.remove("d-none");  // Mostrar Register/Login
        loggedIn.classList.add("d-none");      // Ocultar Upload/Logout
    }
}

document.addEventListener("DOMContentLoaded", updateSessionNav);
```

#### Ejemplo 4: Incluir la cabecera (include.js)

```javascript
'use strict';

let include = (htmlFile, selector) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', htmlFile, false);  // Petición síncrona
    xhr.addEventListener('load', () => {
        if (xhr.readyState == 4 && xhr.status == "200") {
            document.querySelector(selector).innerHTML += xhr.responseText;
        }
    });
    xhr.send();
};

window.include = include;  // Hace la función accesible globalmente
```

Se usa en cada página:
```html
<div id="page-header"></div>
<script>include("header.html", "#page-header");</script>
```

#### Ejemplo 5: Mostrar mensajes (messages.js)

```javascript
'use strict';

import { parseHTML } from '../utils/parseHTML.js';

const messageRenderer = {
    showMessageAsAlert: function(message, bootClass) {
        let html = `<div class="alert alert-${bootClass} alert-dismissible fade show">
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        ${message}
                    </div>`;
        let errorsDiv = document.getElementById("errors");
        let messageElem = parseHTML(html);
        errorsDiv.appendChild(messageElem);
    },
    showErrorMessage: function(message) {
        this.showMessageAsAlert(message, "danger");
    },
    showSuccessMessage: function(message) {
        this.showMessageAsAlert(message, "success");
    },
    showWarningMessage: function(message) {
        this.showMessageAsAlert(message, "warning");
    },
};

export { messageRenderer };
```

#### Ejemplo 6: Pasar datos entre páginas (URLSearchParams)

Para pasar datos de la galería a la página de detalle, se usan **query parameters** en la URL:

```javascript
// En la galería (generar el enlace):
`<a href="photo_detail.html?img=${encodeURIComponent(photo.url)}&title=${encodeURIComponent(photo.title)}&desc=${encodeURIComponent(photo.description)}">`

// En la página de detalle (leer los datos):
const params = new URLSearchParams(window.location.search);
const img = params.get('img');
const title = params.get('title');
const desc = params.get('desc');

if (img) {
    document.querySelector('main img').src = img;
}
if (title) {
    document.querySelector('main h3').textContent = title;
}
```

- `encodeURIComponent()` → Codifica caracteres especiales para que sean seguros en una URL.
- `URLSearchParams` → Clase nativa de JavaScript para leer parámetros de la URL.
- `window.location.search` → Devuelve la parte `?param=valor&...` de la URL actual.

### Resumen del flujo de datos del proyecto

```
[Usuario interactúa con el HTML]
        ↓
[Event listener en JS captura el evento]
        ↓
[Handler valida los datos]
        ↓
[API module envía petición HTTP al servidor Silence]
        ↓
[Silence ejecuta la consulta SQL y devuelve JSON]
        ↓
[Renderer genera HTML dinámico con los datos]
        ↓
[Se inyecta en el DOM → el usuario ve el resultado]
```

```
Ficheros involucrados:
HTML (estructura) ← CSS (estilos) ← JS handlers (eventos)
                                         ↓
                                    JS API modules (peticiones HTTP)
                                         ↓
                                    Silence (Python + MySQL)
                                         ↓
                                    JS renderers (generar HTML)
                                         ↓
                                    DOM (página visible)
```
