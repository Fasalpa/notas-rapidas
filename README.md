# 📝 Notas Rápidas

> Aplicación web interactiva para la gestión avanzada de notas personales con **Cápsulas del Tiempo** bloqueadas condicionalmente, **Autodestrucción programada en tiempo real**, seguimiento del estado de ánimo y **operaciones CRUD completas**.

### En construcción?

* Si, esta app sigue mejorando (**pronto implementará la versión con backend para almacenamiento en bases de datos**)

---

## 🚀 Características Principales

* **CRUD Completo (Create, Read, Update, Delete):**
  * **Creación:** Notas con título, contenido, personalización de color de fondo y estado de ánimo.
  * **Lectura & Renderizado Dinámico:** Grid responsivo autoadaptable según el viewport.
  * **Edición (Update):** Modal centrado emergente para consultar el detalle completo y modificar notas existentes.
  * **Eliminación (Delete):** Borrado manual por nota con actualización inmediata del DOM.
* **🔒 Cápsulas del Tiempo:**
  * Bloqueo programado de notas mediante selección de fecha/hora.
  * Renderizado condicional: El contenido sensible permanece protegido y la edición queda deshabilitada hasta que se cumpla la fecha de apertura.
* **🌋 Autodestrucción Programada:**
  * Contador en vivo (días, horas, minutos, segundos) mediante `setInterval`.
  * Algoritmo de filtrado automático que purga y elimina de la memoria las notas expiradas.
* **😊 Mood Tracking (Estado de Ánimo):**
  * Slider interactivo con rangos dinámicos y cambio de color en tiempo real (de *Terrible 😫* a *Increíble 😁*).
* **🎯 Filtros Dinámicos Non-Destructive:**
  * Visualización categorizada (Todas, Ánimo, Cápsulas) sin mutar la fuente de datos original.
* **💾 Persistencia de Datos:**
  * Sincronización automática de todas las operaciones mediante `localStorage`.

---

## 🛠️ Tecnologías y Patrones Utilizados

* **HTML5:** Marcación semántica, modales nativos y controles de formulario estructurados.
* **CSS3 Moderno (No Media Queries):**
  * **Layout Autoadaptable:** `grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))` para un comportamiento responsivo nativo en Mobile, Tablet y Desktop.
  * **Tipografía y Espaciado Fluido:** Uso de funciones dinámicas `clamp()`.
  * **Microinteracciones & Pseudoelementos:** Animaciones suaves en botones con `::before`, curvas `cubic-bezier` e `isolation: isolate` para la gestión de capas.
  * **Diseño visual:** Variables CSS (Custom Properties), `backdrop-filter: blur()`, Flexbox y Grid.
* **JavaScript (Vanilla - ES6+):**
  * **Manipulación del DOM & Delegación de Eventos:** Escuchadores de eventos optimizados en contenedores principales.
  * **Programación Asíncrona & Timers:** Gestión de temporizadores en segundo plano con `setInterval` y manipulación de fechas con la API `Date`.
  * **Inmutabilidad y Métodos de Arreglos:** Uso extenso de `.map()`, `.filter()`, `.find()` y el operador Spread (`...`).
  * **Identificadores Únicos:** Generación de ID mediante `crypto.randomUUID()`.
* **Git & GitHub:** Flujo de trabajo profesional basado en la estrategia **GitFlow** (`main`, `develop`, `feature/*`).

---

## 📁 Estrategia de Ramas (GitFlow)

El desarrollo del proyecto se estructuró a través de entregas incrementales en ramas de características:

```text
main (Producción)
  └── develop (Integración)
        ├── feature/button-styles        ───> Microinteracciones y CSS fluido
        ├── feature/filters-and-polish   ───> Filtros y pulido de UI
        └── feature/modal-and-update     ───> Modal de detalle y lógica de actualización (U)