using AsistenciaApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var frontendUrl = builder.Configuration.GetValue<string>("FrontendUrl") ?? "http://localhost:5173";

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVite",
        policy =>
        {
            policy.WithOrigins(frontendUrl, "http://localhost:5173", "http://127.0.0.1:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? builder.Configuration["DefaultConnection"];

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("AllowVite");

app.UseAuthorization();

app.MapControllers();

app.MapGet("/api/health", async (AppDbContext db) => {
    try {
        bool canConnect = await db.Database.CanConnectAsync();
        return canConnect 
            ? Results.Ok("Conexión a la Base de Datos: EXITOSA.") 
            : Results.Problem("La conexión falló pero no se arrojó una excepción.");
    } catch (Exception ex) {
        return Results.Problem("Error conectando a DB: " + ex.Message + " | Inner: " + ex.InnerException?.Message);
    }
});

app.MapFallbackToFile("index.html");

app.Run();
