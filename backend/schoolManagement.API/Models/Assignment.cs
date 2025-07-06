using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
 public class Assignment
  {
      public int AssignmentId { get; set; }
      public int CourseId { get; set; }
      public string Title { get; set; }
      public string FilePath { get; set; }
      public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

      public Course Course { get; set; }
  }
}


