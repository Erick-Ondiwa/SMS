using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Dtos
{    
  public class StudentAttendanceDto
  {
    public string StudentId { get; set; }
    public string AdmissionNumber { get; set; }
    public string FullName { get; set; }
    public Dictionary<int, bool?> Weeks { get; set; }
  }


}
    
