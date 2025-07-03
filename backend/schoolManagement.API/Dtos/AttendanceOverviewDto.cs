using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Dtos
{  
 public class AttendanceOverviewDto
  {
      public string StudentId { get; set; }
      public string AdmissionNumber { get; set; }
      public string FullName { get; set; }
      public Dictionary<int, bool?> Weeks { get; set; }
      public string Remarks { get; set; }
  }

}


