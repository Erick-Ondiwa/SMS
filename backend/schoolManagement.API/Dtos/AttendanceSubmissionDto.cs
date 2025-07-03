using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Dtos
{ 
  public class AttendanceSubmissionDto
  {
      public int CourseId { get; set; }
      public int Week { get; set; }
      public List<AttendanceEntryDto> Attendance { get; set; }
  }

  public class AttendanceEntryDto
  {
      public string StudentId { get; set; }
      public bool IsPresent { get; set; }
  }
}
