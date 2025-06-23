using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Models
{
    public class AcademicProgram
    {
        [Key]
        public int ProgramId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty; // e.g., "BSc Computer Science"

        [MaxLength(100)]
        public string? Category { get; set; } // e.g., "Science", "Arts", "Business"

        [Range(1, 10)]
        public int DurationInYears { get; set; } // e.g., 4 for a 4-year course

        [MaxLength(500)]
        public string? Description { get; set; }

        // Navigation property
        public ICollection<Student> Students { get; set; } = new List<Student>();
         public ICollection<Course> Courses { get; set; } = new List<Course>();
    }
}
