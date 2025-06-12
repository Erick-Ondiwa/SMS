using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? ProfilePictureUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLogin { get; set; }

        // Navigation Properties
        public Student? Student { get; set; }
        public Teacher? Teacher { get; set; }
        public Parent? Parent { get; set; }
        public Admin? Admin { get; set; }
    }
}


// using System;
// using System.ComponentModel.DataAnnotations;
// using Microsoft.AspNetCore.Identity;

// namespace schoolManagement.API.Models
// {
//     public class ApplicationUser : IdentityUser
//     {

//         [MaxLength(100)]
//         public required string FirstName { get; set; }

//         [MaxLength(100)]
//         public required string LastName { get; set; }

//         public string? ProfilePictureUrl { get; set; }

//         public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

//         public DateTime? LastLogin { get; set; }

//         // Navigation Properties
//         public Student? Student { get; set; }
//         public Teacher? Teacher { get; set; }
//         public Parent? Parent { get; set; }
//         public Admin? Admin { get; set; }
//     }
// }
