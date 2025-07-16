using System;
using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Dtos
{
    public class CreateResultDto
    {
        [Required]
        public string StudentId { get; set; }

        [Required]
        public int CourseId { get; set; }

        [Range(0, 30)]
        public decimal CATScore { get; set; }

        // [Range(0, 20)]
        public decimal AssignmentScore { get; set; } = 0;

        [Range(0, 70)]
        public decimal ExamScore { get; set; }
    }
}
