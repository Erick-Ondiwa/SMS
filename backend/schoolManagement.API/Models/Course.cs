using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Course
    {
        [Key]
        public int CourseId { get; set; }

        [Required]
        [MaxLength(20)]
        public string CourseCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        [Range(1, 10, ErrorMessage = "Credit hours must be between 1 and 10.")]
        public int CreditHours { get; set; }

        [Range(1, 6)]
        public int YearOfStudy { get; set; } = 1;

        [Range(1, 3)]
        public int Semester { get; set; } = 1;

        // Link to Teacher
        public string? TeacherId { get; set; }

        [ForeignKey(nameof(TeacherId))]
        public Teacher? Teacher { get; set; }

        // NEW: Link to Program
        [Required]
        public int? ProgramId { get; set; }

        [ForeignKey(nameof(ProgramId))]
        public AcademicProgram AcademicProgram { get; set; } = null;

        public string Status { get; set; } = "Active";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
        public ICollection<Assignment> Assignments { get; set; }

    }
}

