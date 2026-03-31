using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AsistenciaApi.Models;
using AsistenciaApi.Data;

namespace AsistenciaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttendanceController(AppDbContext context)
        {
            _context = context;
        }

        // Historial panel Admin
        [HttpGet("records")]
        public async Task<ActionResult<IEnumerable<object>>> GetRecords()
        {
            var records = await _context.AttendanceRecords
                .Include(r => r.Worker)
                .Select(r => new {
                    r.Id,
                    WorkerId = r.WorkerId,
                    WorkerName = r.Worker.Name,
                    WorkerDni = r.Worker.Dni,
                    WorkerArea = r.Worker.Area,
                    Date = r.Date.ToString("dd/MM/yyyy"),
                    InTime = r.InTime.HasValue ? r.InTime.Value.ToString(@"hh\:mm") : "--:--",
                    OutTime = r.OutTime.HasValue ? r.OutTime.Value.ToString(@"hh\:mm") : "--:--",
                    Status = r.Status
                })
                .OrderByDescending(r => r.Id)
                .ToListAsync();

            return Ok(records);
        }

        // Principal para Kiosco
        [HttpPost("mark")]
        public async Task<IActionResult> MarkAttendance([FromBody] MarkRequest request)
        {
            var worker = await _context.Workers.FirstOrDefaultAsync(w => w.Dni == request.Dni);
            
            if (worker == null)
                return NotFound(new { message = "DNI no registrado en el sistema." });

            var today = DateTime.Today;
            var currentTime = DateTime.Now.TimeOfDay;

            var record = await _context.AttendanceRecords
                .FirstOrDefaultAsync(r => r.WorkerId == worker.Id && r.Date == today);

            if (request.Type == "ENTRADA")
            {
                if (record != null && record.InTime.HasValue)
                    return BadRequest(new { message = "Ya tienes una entrada registrada el día de hoy." });

                if (record == null)
                {
                    record = new AttendanceRecord
                    {
                        WorkerId = worker.Id,
                        Date = today,
                        InTime = currentTime,
                        Status = currentTime.Hours >= 9 ? "Tarde" : "A tiempo" // Despues de 9am es tarde
                    };
                    _context.AttendanceRecords.Add(record);
                }
                else
                {
                    record.InTime = currentTime;
                    record.Status = currentTime.Hours >= 9 ? "Tarde" : "A tiempo";
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = $"¡Entrada registrada correctamente para {worker.Name}!" });
            }
            else if (request.Type == "SALIDA")
            {
                if (record == null || !record.InTime.HasValue)
                    return BadRequest(new { message = "Debes registrar tu entrada primero." });

                if (record.OutTime.HasValue)
                    return BadRequest(new { message = "Ya tienes una salida registrada el día de hoy." });

                record.OutTime = currentTime;
                await _context.SaveChangesAsync();
                
                return Ok(new { message = $"¡Salida registrada correctamente para {worker.Name}!" });
            }

            return BadRequest(new { message = "Tipo de operación no válida." });
        }
    }

    public class MarkRequest
    {
        public string Dni { get; set; }
        public string Type { get; set; } // "ENTRADA" o "SALIDA"
    }
}
