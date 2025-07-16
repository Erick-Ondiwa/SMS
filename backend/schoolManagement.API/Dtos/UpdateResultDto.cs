using System;
using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Dtos
{
    public class UpdateResultDto
    {
        [Required]
        public Guid ResultId { get; set; }

        [Range(0, 30)]
        public decimal CATScore { get; set; }

        [Range(0, 20)]
        public decimal AssignmentScore { get; set; }

        [Range(0, 50)]
        public decimal ExamScore { get; set; }

        public bool Submitted { get; set; } = false;
    }
}
