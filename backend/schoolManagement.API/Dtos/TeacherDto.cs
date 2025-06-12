using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.DTOs
{
    public class TeacherDto
    {
        public string? TeacherId { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(100)]
        public string? Department { get; set; }

        [MaxLength(255)]
        public string? Address { get; set; }

        public string? PhotoUrl { get; set; }
    }
}
