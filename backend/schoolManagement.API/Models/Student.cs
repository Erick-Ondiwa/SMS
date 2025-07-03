using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Student
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string StudentId { get; set; }

        // Link to ASP.NET Identity user
        public string? UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser? ApplicationUser { get; set; }

        // --- Academic Profile Info ---

          // Foreign Key to Program
        public int? ProgramId { get; set; }

        [ForeignKey("ProgramId")]
        public AcademicProgram? AcademicProgram { get; set; }

        [Range(1, 6)]
        public int YearOfStudy { get; set; } = 1;

        [Range(1, 3)]
        public int Semester { get; set; } = 1;

        [MaxLength(50)]
        public string? AdmissionNumber { get; set; } // Unique identifier for student

        public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;

        // --- Personal Info ---
        [MaxLength(100)]
        public string? FullName { get; set; }

        [MaxLength(100)]
        public string? Email { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [MaxLength(10)]
        public string? Gender { get; set; }

        [MaxLength(255)]
        public string? Address { get; set; }

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(255)]
        public string? PhotoUrl { get; set; }

        // Parent Relationship (optional)
        public string? ParentId { get; set; }

        [ForeignKey("ParentId")]
        public Parent? Parent { get; set; }

        // Navigation Properties
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    }
}


