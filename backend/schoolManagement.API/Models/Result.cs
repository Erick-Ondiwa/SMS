using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Result
    {
        [Key]
        public Guid ResultId { get; set; }

        [Required]
        public string StudentId { get; set; }

        [ForeignKey("StudentId")]
        public Student Student { get; set; }

        [Required]
        public int CourseId { get; set; }

        [ForeignKey("CourseId")]
        public Course Course { get; set; }

        [Range(0, 100)]
        public decimal? CATScore { get; set; }

        [Range(0, 100)]
        public decimal? AssignmentScore { get; set; }

        [Range(0, 100)]
        public decimal? ExamScore { get; set; }

        [Range(0, 100)]
        public decimal? TotalScore { get; set; }

        [MaxLength(2)]
        public string Grade { get; set; }

        [MaxLength(100)]
        public string Remarks { get; set; }

        public bool Submitted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
