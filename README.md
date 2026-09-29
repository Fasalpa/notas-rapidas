# 📝 Notas Rápidas API & Web App

> **De ideas temporales a realidad.**  
> Aplicación web Full Stack para crear, editar y gestionar notas temporales, con cápsulas del tiempo y autodestrucción programada.

## 🚀 Características

- **Gestión CRUD:** creación, consulta, edición mediante modal y eliminación de notas.
- **Notas activas:** el backend excluye las notas caducadas de las consultas generales.
- **Autodestrucción:** fecha programada y contador visual en tiempo real.
- **Purga automática:** tarea de Spring Boot que elimina notas caducadas a las 3:00 AM (*para no cargar el backend con infinitas consultas*).
- **Cápsulas del tiempo:** bloquea el contenido hasta la fecha de apertura elegida.
- **Personalización:** colores de fondo y seguimiento del estado de ánimo.
- **Filtros dinámicos:** clasificación por todas las notas, ánimo y cápsulas.

## 🛠️ Tecnologías

### Backend
- Java 17+
- Spring Boot, Spring Data JPA y Spring Web
- PostgreSQL o MySQL
- Lombok y Maven
- Tareas programadas con `@Scheduled`

### Frontend
- JavaScript ES6+, HTML5 y CSS3
- Bootstrap 5
- Diseño responsive y propiedades personalizadas de CSS

## 📂 Estructura del proyecto

```text
notas-rapidas/
├── src/main/java/com/notas/notas_rapidas_api/
│   ├── config/       # Configuración de CORS
│   ├── controller/   # Endpoints REST
│   ├── model/        # Entidades JPA
│   ├── repository/   # Consultas de datos
│   └── service/      # Lógica de negocio y tareas programadas
└── Frontend/
    ├── css/
    ├── js/
    └── index.html
```

## 🔌 API REST

Base URL: `http://localhost:8080/api/notes`

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/` | Obtiene las notas activas |
| `GET` | `/{id}` | Obtiene una nota por su UUID |
| `POST` | `/` | Crea una nota |
| `PUT` | `/{id}` | Actualiza una nota |
| `DELETE` | `/{id}` | Elimina una nota |

## ⚙️ Instalación y ejecución

### Requisitos

- Java JDK 17 o superior
- Maven 3.x
- PostgreSQL o MySQL

### 1. Configurar la base de datos

Configura las credenciales en `src/main/resources/application.properties`. Por ejemplo, para PostgreSQL:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/notas_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=update
```

### 2. Ejecutar el backend

Desde la raíz del proyecto:

```bash
mvn spring-boot:run
```

### 3. Ejecutar el frontend

Abre `Frontend/index.html` en el navegador o sírvelo localmente, por ejemplo, con Live Server en VS Code.

## ✒️ Autor

**Robinson Fabián Salamanca Palacio**  
Desarrollador Full Stack Java y estudiante de Ingeniería de Sistemas.