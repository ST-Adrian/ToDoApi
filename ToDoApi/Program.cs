using Microsoft.EntityFrameworkCore;
using ToDoApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// =====================================================================
// 1. CONFIGURACIÓN DE CORS (Servicios)
// Le decimos a la API que permita recibir peticiones desde cualquier origen, 
// método (GET, POST, etc.) y encabezado.
// =====================================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTodo", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddDbContext<TareasContext>(opciones =>
    opciones.UseSqlite("Data Source=tareas.db"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// =====================================================================
// 2. ACTIVAR CORS (Middleware)
// ¡Importante! Debe ir ANTES de UseAuthorization y MapControllers
// =====================================================================
app.UseCors("PermitirTodo");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();