using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models{
  public class AdminActivity
{
    public int Id { get; set; }
    public string ActivityType { get; set; }  // e.g. "User Registered", "Role Assigned"

    [Required]
    public string PerformedBy { get; set; } 

    public string TargetUser { get; set; }    // The affected user (email or username)
    public string Description { get; set; }   // Custom message
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
}

