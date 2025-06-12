using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Teacher
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string TeacherId { get; set; }

        // Link to Identity user
        public string? UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser? ApplicationUser { get; set; }


        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(100)]
        public string? Department { get; set; }

        [MaxLength(255)]
        public string? Address { get; set; }

        [MaxLength(300)]
        public string? PhotoUrl { get; set; }

        // Navigation 
        public ICollection<Course> Courses { get; set; } = new List<Course>();
        // public ICollection<Grade> Grades { get; set; } = new List<Grade>();
    }
}
