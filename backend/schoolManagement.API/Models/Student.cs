using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Student
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string StudentId { get; set; }

        [Required]
        public string UserId { get; set; }
        public ApplicationUser? ApplicationUser { get; set; }

        [Required]
        [MaxLength(50)]
        public string? AdmissionNumber { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [MaxLength(10)]
        public string? Gender { get; set; }

        public DateTime EnrollmentDate { get; set; }

        public string? ParentId { get; set; }
        public Parent? Parent { get; set; }

        [MaxLength(255)]
        public string? Address { get; set; }

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        public string? PhotoUrl { get; set; }

        // Navigation properties
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    }
}
