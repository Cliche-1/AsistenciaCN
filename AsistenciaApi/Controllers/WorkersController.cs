using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AsistenciaApi.Models;
using AsistenciaApi.Data;

namespace AsistenciaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WorkersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Worker>>> GetWorkers()
        {
            return await _context.Workers.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Worker>> PostWorker(Worker worker)
        {
            _context.Workers.Add(worker);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWorker", new { id = worker.Id }, worker);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Worker>> GetWorker(int id)
        {
            var worker = await _context.Workers.FindAsync(id);

            if (worker == null)
            {
                return NotFound();
            }

            return worker;
        }
    }
}
