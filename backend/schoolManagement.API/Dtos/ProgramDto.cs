using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Dtos
{
    public class ProgramDto
    {
        public int? ProgramId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty; // e.g., "BSc Computer Science"

        [MaxLength(100)]
        public string? Category { get; set; } // e.g., "Science", "Arts", "Business"

        [Range(1, 10)]
        public int DurationInYears { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }
    }
}
