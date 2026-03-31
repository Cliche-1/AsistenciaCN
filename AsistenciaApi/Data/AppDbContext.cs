using Microsoft.EntityFrameworkCore;
using AsistenciaApi.Models;

namespace AsistenciaApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Worker> Workers { get; set; }
        public DbSet<AttendanceRecord> AttendanceRecords { get; set; }
    }
}
