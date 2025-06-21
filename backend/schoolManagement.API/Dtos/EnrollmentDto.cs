using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Dtos
{
  public class EnrollmentDto
  {
      public string StudentId { get; set; }
      public int CourseId { get; set; }
  }

}

