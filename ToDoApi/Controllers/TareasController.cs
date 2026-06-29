using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoApi.Models;

namespace ToDoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TareasController : ControllerBase
    {
        private readonly TareasContext _context;

        public TareasController(TareasContext context)
        {
            _context = context;
        }

        // GET: api/Tareas?usuarioId=anon-123
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tarea>>> ObtenerTareas([FromQuery] string usuarioId)
        {
            if (string.IsNullOrEmpty(usuarioId)) return BadRequest("El usuarioId es requerido.");

            // Filtramos en la base de datos antes de traer la lista
            return await _context.Tareas.Where(t => t.UsuarioId == usuarioId).ToListAsync();
        }

        // POST: api/Tareas
        [HttpPost]
        public async Task<ActionResult<Tarea>> CrearTarea([FromBody] Tarea nuevaTarea)
        {
            var palabrasProhibidas = new List<string> { "tonto", "feo", "hack", "drop table" };

            bool contienePalabraIndebida = palabrasProhibidas.Any(palabra =>
                nuevaTarea.Titulo.ToLower().Contains(palabra));

            if (contienePalabraIndebida)
            {
                return BadRequest(new { mensaje = "Por favor, mantengamos un lenguaje profesional en la demo." });
            }

            _context.Tareas.Add(nuevaTarea);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ObtenerTareas), new { usuarioId = nuevaTarea.UsuarioId }, nuevaTarea);
        }

        // PUT: api/Tareas/5?usuarioId=anon-123
        [HttpPut("{id:int}")]
        public async Task<IActionResult> ActualizarTarea(int id, [FromQuery] string usuarioId, [FromBody] Tarea tareaActualizada)
        {
            // Buscamos la tarea asegurándonos de que pertenezca a ese usuario
            var tarea = await _context.Tareas.FirstOrDefaultAsync(t => t.Id == id && t.UsuarioId == usuarioId);
            if (tarea == null) return NotFound("Tarea no encontrada o no autorizada.");

            tarea.Titulo = tareaActualizada.Titulo;
            tarea.EstaCompletada = tareaActualizada.EstaCompletada;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Tareas/5?usuarioId=anon-123
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> EliminarTarea(int id, [FromQuery] string usuarioId)
        {
            var tarea = await _context.Tareas.FirstOrDefaultAsync(t => t.Id == id && t.UsuarioId == usuarioId);
            if (tarea == null) return NotFound("Tarea no encontrada o no autorizada.");

            _context.Remove(tarea);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // =========================================================
        // ACCIONES MASIVAS FILTRADAS POR USUARIO
        // =========================================================

        [HttpPut("completar-todos")]
        public async Task<IActionResult> CompletarTodos([FromQuery] string usuarioId)
        {
            var tareas = await _context.Tareas.Where(t => t.UsuarioId == usuarioId).ToListAsync();
            foreach (var t in tareas) t.EstaCompletada = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("restaurar-todos")]
        public async Task<IActionResult> RestaurarTodos([FromQuery] string usuarioId)
        {
            var tareas = await _context.Tareas.Where(t => t.UsuarioId == usuarioId).ToListAsync();
            foreach (var t in tareas) t.EstaCompletada = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("eliminar-todos")]
        public async Task<IActionResult> EliminarTodos([FromQuery] string usuarioId)
        {
            var tareas = await _context.Tareas.Where(t => t.UsuarioId == usuarioId).ToListAsync();
            _context.Tareas.RemoveRange(tareas);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}