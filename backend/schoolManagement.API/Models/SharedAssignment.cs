using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
  public class SharedAssignment
{
    public int SharedAssignmentId { get; set; }

    public int AssignmentId { get; set; }
    public Assignment Assignment { get; set; } = null!;

    public string StudentId { get; set; }
    public Student Student { get; set; } = null!;

    public DateTime SharedAt { get; set; } = DateTime.UtcNow;
}

}