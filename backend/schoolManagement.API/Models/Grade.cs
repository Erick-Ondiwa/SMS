using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Grade
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int GradeId { get; set; }

        [Required]
        public string StudentId { get; set; }

        [Required]
        public int CourseId { get; set; }  // ✅ Add this line

        public Enrollment? Enrollment { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        [Range(0, 100, ErrorMessage = "Score must be between 0 and 100.")]
        public decimal Score { get; set; }

        [Required]
        [MaxLength(2)]
        public string? LetterGrade { get; set; }  // e.g., A, B+, C-

        [MaxLength(500)]
        public string? Comments { get; set; }

        [Required]
        public DateTime DateGraded { get; set; }
    }
}


