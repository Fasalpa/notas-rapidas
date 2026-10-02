# 📝 Notas Rápidas API & Web App

Aplicación web full-stack para la gestión de notas personales, construida con una arquitectura desacoplada: backend con **Spring Boot**, base de datos relacional con **PostgreSQL (Supabase)** y despliegue en la nube mediante **Render**.

---

## 🚀 Demo en Vivo / Producción

* **Backend API (Render):** `https://notas-rapidas-api.onrender.com`
* **Endpoint Principal:** `https://notas-rapidas-api.onrender.com/api/notes`

---

## 🛠️ Tecnologías Utilizadas

### Backend
* **Java 21**
* **Spring Boot 3** (Spring Data JPA, Spring Web)
* **Maven** (Gestión de dependencias)
* **PostgreSQL / Supabase** (Base de datos relacional)
* **Docker** (Containerización para el despliegue)

### Frontend
* **HTML5 / CSS3 / JavaScript (ES6+)**
* **Fetch API** (Consumo de servicios RESTful)

### Infraestructura y Despliegue
* **Render** (Servicio web basado en contenedor Docker)
* **Supabase** (Servicio de PostgreSQL administrado)

---

## 🔐 Configuración de Variables de Entorno

Por buenas prácticas de seguridad, ninguna credencial o contraseña está harcodeada en el repositorio. Para ejecutar el backend localmente o desplegarlo, se requieren las siguientes variables de entorno:

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | URL JDBC de conexión a PostgreSQL | `jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | Usuario de la base de datos | `postgres.xxxxxx` |
| `SPRING_DATASOURCE_PASSWORD` | Contraseña de la base de datos | `tu_contraseña_segura` |

---

## 📂 Estructura del Proyecto

```text
notas-rapidas/
├── Backend/
│   └── notas-rapidas-api/
│       ├── src/
│       ├── Dockerfile           # Configuración de compilación multicapa (Java 21 + Maven)
│       ├── pom.xml
│       └── application.properties
├── Frontend/
│   ├── index.html
│   ├── css/
│   └── js/
└── README.md
```

## ⚙️ Ejecución Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Fasalpa/notas-rapidas.git
cd notas-rapidas/Backend/notas-rapidas-api
```

### 2. Configurar variables de entorno

Configura en tu IDE (IntelliJ IDEA / VS Code) o en tu terminal las variables `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` y `SPRING_DATASOURCE_PASSWORD`.

### 3. Ejecutar la aplicación

```bash
./mvnw spring-boot:run
```

La API estará disponible localmente en `http://localhost:8080/api/notes`.

## 📡 Endpoints de la API

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/notes` | Obtener todas las notas |
| `POST` | `/api/notes` | Crear una nueva nota |
| `DELETE` | `/api/notes/{id}` | Eliminar una nota por ID |

## ✒️ Autor

**Robinson Fabián Salamanca Palacio**  
Desarrollador Full Stack Java y estudiante de Ingeniería de Sistemas.
