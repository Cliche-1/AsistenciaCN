using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsistenciaApi.Models
{
    public class AttendanceRecord
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int WorkerId { get; set; }

        [ForeignKey("WorkerId")]
        public Worker Worker { get; set; }

        [Required]
        public DateTime Date { get; set; } 

        public TimeSpan? InTime { get; set; }
        
        public TimeSpan? OutTime { get; set; }

        public string Status { get; set; } // A tiempo, Tarde, Falta
    }
}
