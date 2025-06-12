using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Enrollment
    {
        [Key]
        public int EnrollmentId { get; set; }

        [Required]
        public string StudentId { get; set; }

        [ForeignKey(nameof(StudentId))]
        public Student? Student { get; set; }

        [Required]
        public int CourseId { get; set; }

        [ForeignKey(nameof(CourseId))]
        public Course? Course { get; set; }

        [Required]
        public DateTime EnrollmentDate { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Pending"; // Better default than empty string

        // Navigation property for Grades
        public ICollection<Grade> Grades { get; set; } = new List<Grade>();
    }
}



// using System;
// using System.Collections.Generic;
// using System.ComponentModel.DataAnnotations;

// namespace schoolManagement.API.Models
// {
//     public class Enrollment
//     {
//         [Key]
//         public int EnrollmentId { get; set; }

//         [Required]
//         public string StudentId { get; set; }
//         public Student? Student { get; set; }

//         [Required]
//         public int CourseId { get; set; }
//         public Course? Course { get; set; }

//         [Required]
//         public DateTime EnrollmentDate { get; set; }

//         [Required]
//         [MaxLength(20)]
//         public string Status { get; set; } = string.Empty;

//         // Navigation for Grades (one-to-many)
//         public ICollection<Grade> Grades { get; set; } = new List<Grade>();
//     }
// }
