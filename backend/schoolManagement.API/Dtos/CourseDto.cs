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
        [MaxLength(20)]
        public string Semester { get; set; }

        [Required]
        [MaxLength(20)]
        public string Level { get; set; }

        public string Status { get; set; }

        public string? TeacherId { get; set; }  // Can be null initially
        public string? TeacherName { get; set; }  // Optional for display

        public DateTime CreatedAt { get; set; }

        public TeacherDto? Teacher { get; set; }

        //[Required]
        public int? ProgramId { get; set; }

        public ProgramDto? AcademicProgram { get; set; }  // Optional for display

        public int TotalStudents { get; set; }
    }
}
