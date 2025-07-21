using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Dtos
{
    public class CourseDto
    {
        public int? CourseId { get; set; }  // Optional for creation, required for update

        [Required]
        [MaxLength(20)]
        public string CourseCode { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        [Range(1, 10)]
        public int CreditHours { get; set; }

        [Required]
        [Range(1, 6)]
        public int Semester { get; set; } = 1;

        [Required]
        [Range(1, 6)]
        public int YearOfStudy { get; set; } = 1;
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? TeacherId { get; set; } 
        // public string? TeacherName { get; set; }  // Optional for display
        public TeacherDto? Teacher { get; set; }
        public int? ProgramId { get; set; }
        public ProgramDto? AcademicProgram { get; set; }  // Optional for display
        public int TotalStudents { get; set; }
    }
}
