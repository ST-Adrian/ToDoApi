# ToDoApi: API REST en ASP.NET Core

Proyecto desarrollado para la cátedra **Programación Aplicada I** de la carrera **Analista Universitario en Sistemas Informáticos** (UNC).

Este repositorio constituye la **demo funcional** solicitada como parte del Trabajo Práctico N°1, cuyo objetivo es profundizar y demostrar el funcionamiento del ecosistema .NET mediante la construcción de una API RESTful.

---

## 📋 Descripción del Proyecto
La aplicación consiste en una **API REST** para la gestión de una lista de tareas (*To-Do List*). Permite realizar operaciones CRUD (Create, Read, Update, Delete) sobre tareas, demostrando los estándares modernos de desarrollo de servicios backend con **ASP.NET Core**.

### Características Técnicas
* **Framework:** ASP.NET Core (.NET 10.0).
* **Arquitectura:** RESTful, basada en Controladores.
* **Persistencia:** Memoria estática (para propósitos de demostración).
* **Documentación:** Soporte integrado para pruebas mediante archivos `.http`.

---

## 🚀 Instalación y Configuración

### Requisitos previos
1. **Visual Studio 2026** (o superior) con la carga de trabajo *Desarrollo de ASP.NET y web*.
2. **.NET SDK 10.0** instalado.

### Pasos para ejecutar la API
1. Clona este repositorio en tu equipo:
   git clone [https://github.com/ST-Adrian/ToDoApi.git](https://github.com/ST-Adrian/ToDoApi.git)
2. Abre el archivo ToDoApi.sln con Visual Studio.
3. Presiona el botón Play (https) en la barra de herramientas superior.
4. El servidor se iniciará automáticamente (por defecto en http://localhost:5020).

---

## 🛠️ Cómo utilizar la API (Demo)

Puedes probar los servicios utilizando el archivo ToDoApi.http incluido en la raíz del proyecto.

Acción: Listar tareas | Método: GET | Endpoint: /api/Tareas
Acción: Crear tarea | Método: POST | Endpoint: /api/Tareas
Acción: Actualizar tarea | Método: PUT | Endpoint: /api/Tareas/{id}
Acción: Eliminar tarea | Método: DELETE | Endpoint: /api/Tareas/{id}

Haz clic en el enlace "Enviar solicitud" que aparece sobre cada bloque de código en el archivo .http para ver la respuesta del servidor en tiempo real.

---

## 🎓 Sobre el Trabajo Práctico
Este código es el componente práctico de la monografía "Profundizando el ecosistema .NET". El objetivo es ilustrar conceptos como:
* Inyección de Dependencias.
* Ruteo por atributos.
* Modelo de transferencia de estado representacional (REST).

---

## 👨‍💻 Autores
* [Tu Nombre]
* [Nombre de tu compañero/a]
* [Nombre de tu compañero/a]
