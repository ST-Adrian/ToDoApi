using Microsoft.EntityFrameworkCore;
using ToDoApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// =====================================================================
// 1. CONFIGURACIÓN DE CORS (Servicios)
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

// =====================================================================
// 2. CREACIÓN AUTOMÁTICA DE LA BASE DE DATOS
// Esto asegura que las tablas se creen al arrancar el servidor
// =====================================================================
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TareasContext>();
    db.Database.EnsureCreated();
}

// =====================================================================
// 3. ACTIVAR CORS (Middleware)
// =====================================================================
app.UseCors("PermitirTodo");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();