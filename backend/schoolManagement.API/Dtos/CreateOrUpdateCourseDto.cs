using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Dtos
{
  public class CreateOrUpdateCourseDto
  {
      public string CourseCode { get; set; }
      public string Title { get; set; }
      public string Description { get; set; }
      public int CreditHours { get; set; }
      public int YearOfStudy { get; set; }
      public int Semester { get; set; }
      public string Status { get; set; }

      public string? TeacherId { get; set; }
      public int? ProgramId { get; set; }
  }
}

