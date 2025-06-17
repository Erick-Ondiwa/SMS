using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class AdminActivity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string ActivityType { get; set; } = string.Empty;  // e.g., "User Registered", "Role Assigned"

        [Required]
        public string PerformedBy { get; set; } = string.Empty;  // UserId or Admin email

        [MaxLength(256)]
        public string? TargetUser { get; set; }  // Could be null if the activity isn't user-specific

        [MaxLength(1000)]
        public string? Description { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}

