using System.ComponentModel.DataAnnotations;

namespace AsistenciaApi.Models
{
    public class Worker
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(8)]
        public string Dni { get; set; }

        [Required]
        [StringLength(50)]
        public string Area { get; set; }

        public string Status { get; set; } = "Activo"; // Activo, Inactivo
    }
}
