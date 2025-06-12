using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Attendance
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AttendanceId { get; set; }

        [Required]
        public string StudentId { get; set; }

        [ForeignKey(nameof(StudentId))]
        public Student? Student { get; set; }

        [Required]
        public int CourseId { get; set; }

        [ForeignKey(nameof(CourseId))]
        public Course? Course { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Present"; // Default value as example

        [MaxLength(500)]
        public string? Remarks { get; set; }
    }
}


// using System;
// using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema;

// namespace schoolManagement.API.Models
// {
//     public class Attendance
//     {
//         [Key]
//         [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
//         public int AttendanceId { get; set; }

//         [Required]
//         public string StudentId { get; set; }
//         public Student? Student { get; set; }

//         [Required]
//         public int CourseId { get; set; }
//         public Course? Course { get; set; }

//         [Required]
//         public DateTime Date { get; set; }

//         [Required]
//         [MaxLength(20)]
//         public string? Status { get; set; } // e.g., "Present", "Absent", "Late", "Excused"

//         [MaxLength(500)]
//         public string? Remarks { get; set; }
//     }
// }
