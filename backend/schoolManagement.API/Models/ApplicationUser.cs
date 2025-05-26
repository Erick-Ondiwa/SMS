using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace schoolManagement.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        [MaxLength(20)]
        public string? Role { get; set; } // e.g., "Student", "Teacher", "Parent", "Admin"

        [MaxLength(100)]
        public string? FirstName { get; set; }

        [MaxLength(100)]
        public string? LastName { get; set; }

        public string? ProfilePictureUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLogin { get; set; }

        // Navigation Properties
        public Student? Student { get; set; }
        public Teacher? Teacher { get; set; }
        public Parent? Parent { get; set; }
    }
}
