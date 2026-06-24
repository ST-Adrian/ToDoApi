namespace ToDoApi.Models
{
    // Esta clase define la estructura de nuestra entidad de datos.
    // Al ser pública (public), el resto de la aplicación puede acceder a ella.
    public class Tarea
    {
        // "get; set;" son descriptores de acceso (Propiedades). 
        // Le dicen a ASP.NET Core que tiene permiso para leer (get) y escribir (set) este valor.
        // Son obligatorios para que el framework pueda serializar (convertir) esta clase a JSON.
        public int Id { get; set; }

        // Asignamos "= string.Empty" para inicializar la variable vacía en lugar de nula.
        // Esto le indica al sistema que el Título es un campo obligatorio para la tarea.
        public string Titulo { get; set; } = string.Empty;

        // El signo de interrogación (?) al lado del tipo string significa "Nullable" (Opcional).
        // Le estamos diciendo a la API que es totalmente válido que el cliente envíe
        // una tarea sin descripción, y no debe devolver un error por ello.
        public string? Descripcion { get; set; }

        // Un campo booleano clásico para controlar el estado. 
        // Por defecto en C#, si no le pasamos ningún valor, arrancará siendo "false".
        public bool EstaCompletada { get; set; }
    }
}