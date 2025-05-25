using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Enrollment
    {
        [Key, Column(Order = 0)]
        [Required]
        public int StudentId { get; set; }

        [Key, Column(Order = 1)]
        [Required]
        public int CourseId { get; set; }

        [ForeignKey(nameof(StudentId))]
        public Student Student { get; set; }

        [ForeignKey(nameof(CourseId))]
        public Course Course { get; set; }

        // Navigation property
        public ICollection<Grade> Grades { get; set; } = new List<Grade>();
    }
}
