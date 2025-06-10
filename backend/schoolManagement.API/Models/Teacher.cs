using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Teacher
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string TeacherId { get; set; }

        [Required]
        public string UserId { get; set; }
        public ApplicationUser? ApplicationUser { get; set; }

        public string? AdminId { get; set; }
        public Admin Admin { get; set; }


        [MaxLength(100)]
        public string? EmployeeNumber { get; set; }

        [MaxLength(100)]
        public string? Specialization { get; set; }

        public DateTime HireDate { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation properties
        public ICollection<Course> Courses { get; set; } = new List<Course>();
        public ICollection<Grade> Grades { get; set; } = new List<Grade>();
    }
}
