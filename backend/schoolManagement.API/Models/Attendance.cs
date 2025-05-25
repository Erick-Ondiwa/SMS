using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Attendance
    {
        [Key, Column(Order = 0)]
        public int StudentId { get; set; }

        [Key, Column(Order = 1)]
        public int CourseId { get; set; }

        [Key, Column(Order = 2)]
        public DateTime Date { get; set; }

        [ForeignKey(nameof(StudentId))]
        public Student Student { get; set; }

        [ForeignKey(nameof(CourseId))]
        public Course Course { get; set; }

        [Required]
        public bool IsPresent { get; set; }
    }
}
