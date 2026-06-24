using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ToDoApi.Models; // Importamos la carpeta donde vive nuestra clase Tarea

namespace ToDoApi.Controllers
{
    // -----------------------------------------------------------------------------
    // [Route] define la URL base para todas las peticiones de este archivo.
    // El "[controller]" es un comodín inteligente de ASP.NET Core. 
    // Como nuestra clase se llama "TareasController", asume que la URL será: /api/Tareas
    // -----------------------------------------------------------------------------
    [Route("api/[controller]")]

    // [ApiController] activa validaciones automáticas. Por ejemplo, si el cliente 
    // manda un JSON mal formado, este atributo devuelve un error 400 (Bad Request) 
    // automáticamente sin que tengamos que escribir código para comprobarlo.
    [ApiController]
    public class TareasController : ControllerBase
    {
        // Para mantener esta primera demo súper sencilla y enfocarnos en aprender REST 
        // (sin necesidad de configurar motores de bases de datos complejos hoy), 
        // usaremos una lista estática en memoria. 
        // Es el equivalente exacto a declarar un arreglo en el scope global del servidor.
        private static List<Tarea> _tareas = new List<Tarea>
        {
            new Tarea { Id = 1, Titulo = "Hacer el TP de Programación Aplicada", EstaCompletada = false },
            new Tarea { Id = 2, Titulo = "Instalar Visual Studio", EstaCompletada = true },
            new Tarea { Id = 3, Titulo = "Que el profe nos ponga 10", EstaCompletada = false }
        };

        // =========================================================================
        // 1. ENDPOINT: OBTENER TODAS LAS TAREAS (READ)
        // =========================================================================
        [HttpGet] // Esta etiqueta le dice al servidor: "Responde solo a peticiones GET"
        public ActionResult<IEnumerable<Tarea>> ObtenerTareas()
        {
            // El método Ok() genera una respuesta HTTP con código de estado 200 (Éxito).
            // Además, toma nuestra lista de objetos en C# y la serializa (convierte) 
            // mágicamente a formato JSON para enviarla al cliente.
            return Ok(_tareas);
        }

        // =========================================================================
        // 2. ENDPOINT: CREAR UNA NUEVA TAREA (CREATE)
        // =========================================================================
        [HttpPost] // Responde a peticiones POST (cuando el cliente envía datos)
        public ActionResult<Tarea> CrearTarea([FromBody] Tarea nuevaTarea)
        {
            // Simulamos la creación de un ID autoincremental como haría una base de datos real.
            // Buscamos el ID más alto y le sumamos 1.
            nuevaTarea.Id = _tareas.Count > 0 ? _tareas.Max(t => t.Id) + 1 : 1;

            // Agregamos la tarea recibida a nuestra "base de datos" temporal.
            _tareas.Add(nuevaTarea);

            // La buena práctica en la arquitectura REST dice que cuando creas algo,
            // debes devolver un código 201 (Created), junto con el objeto recién creado.
            return CreatedAtAction(nameof(ObtenerTareas), new { id = nuevaTarea.Id }, nuevaTarea);
        }
        // =========================================================================
        // 3. ENDPOINT: ACTUALIZAR UNA TAREA (UPDATE)
        // =========================================================================
        [HttpPut("{id}")] // Indicamos que esta ruta espera un ID en la URL (ej: /api/Tareas/1)
        public ActionResult ActualizarTarea(int id, Tarea tareaActualizada)
        {
            // Buscamos si la tarea existe en nuestra lista
            var tarea = _tareas.FirstOrDefault(t => t.Id == id);

            if (tarea == null) return NotFound(); // Si no existe, devolvemos error 404

            // Si existe, actualizamos sus campos
            tarea.Titulo = tareaActualizada.Titulo;
            tarea.EstaCompletada = tareaActualizada.EstaCompletada;
            tarea.Descripcion = tareaActualizada.Descripcion;

            return NoContent(); // Código 204: Éxito pero no devolvemos nada (la tarea ya está actualizada)
        }

        // =========================================================================
        // 4. ENDPOINT: ELIMINAR UNA TAREA (DELETE)
        // =========================================================================
        [HttpDelete("{id}")] // Al igual que el PUT, necesitamos el ID para saber cuál borrar
        public ActionResult EliminarTarea(int id)
        {
            var tarea = _tareas.FirstOrDefault(t => t.Id == id);

            if (tarea == null) return NotFound(); // Si no existe, devolvemos 404

            _tareas.Remove(tarea); // Removemos de la lista

            return NoContent(); // Código 204: Borrado exitoso
        }
    }
}