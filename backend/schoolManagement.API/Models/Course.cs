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

        [Required]
        [MaxLength(20)]
        public string Semester { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Level { get; set; } = string.Empty;

        //[Required]
        public string? TeacherId { get; set; }

        [ForeignKey(nameof(TeacherId))]
        public Teacher? Teacher { get; set; }

        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    }
}


// using System;
// using System.Collections.Generic;
// using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema;

// namespace schoolManagement.API.Models
// {
//     public class Course
//     {
//         [Key]
//         public int CourseId { get; set; }

//         [Required]
//         [MaxLength(20)]
//         public string? CourseCode { get; set; }

//         [Required]
//         [MaxLength(100)]
//         public string? Title { get; set; }

//         [MaxLength(500)]
//         public string? Description { get; set; }

//         [Required]
//         [Range(1, 10, ErrorMessage = "Credit hours must be between 1 and 10.")]
//         public int CreditHours { get; set; }

//         [Required]
//         [MaxLength(20)]
//         public string? Semester { get; set; }

//         [Required]
//         [MaxLength(20)]
//         public string? Level { get; set; }

//         [Required]
//         public string TeacherId { get; set; }
//         public Teacher? Teacher { get; set; }

//         public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
//         public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
//     }
// }
