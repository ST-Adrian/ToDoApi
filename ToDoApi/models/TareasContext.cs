using Microsoft.EntityFrameworkCore;

namespace ToDoApi.Models
{
    // Heredar de DbContext es lo que convierte a esta clase en el ORM.
    public class TareasContext : DbContext
    {
        // Este constructor es necesario para que ASP.NET Core pueda pasarle la 
        // configuración (ej. "usa SQLite con este archivo") cuando arranque la app.
        public TareasContext(DbContextOptions<TareasContext> options) : base(options)
        {
        }

        // Cada DbSet representa una tabla en tu base de datos.
        // EF Core va a crear una tabla llamada "Tareas" basándose en tu modelo "Tarea".
        public DbSet<Tarea> Tareas { get; set; }
    }
}