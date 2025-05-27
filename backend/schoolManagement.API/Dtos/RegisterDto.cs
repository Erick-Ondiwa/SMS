using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Dtos
{
    public class RegisterDto
    {
        [Required]
        [MaxLength(50)]
        public string? Username { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string? Email { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string? Password { get; set; }  // plain password

        [Required]
        [MaxLength(20)]
        public string? Role { get; set; }      // e.g., "Student", "Teacher", etc.

        [MaxLength(100)]
        public string? FirstName { get; set; }

        [MaxLength(100)]
        public string? LastName { get; set; }

        [Phone]
        [MaxLength(20)]
        public string? PhoneNumber { get; set; }
    }
}
