using System.ComponentModel.DataAnnotations;

namespace ToDoApi.Models
{
    public class Tarea
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El título es obligatorio.")]
        [MaxLength(50, ErrorMessage = "El título no puede exceder los 50 caracteres.")]
        public string Titulo { get; set; } = string.Empty;

        public bool EstaCompletada { get; set; }

        // NUEVA COLUMNA: Para saber a quién le pertenece la tarea
        [Required]
        public string UsuarioId { get; set; } = string.Empty;
    }
}