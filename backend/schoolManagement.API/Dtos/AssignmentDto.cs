using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Dtos
{
  public class AssignmentDto
  {
    public int AssignmentId { get; set; }
    public int CourseId { get; set; }
    public string Title { get; set; }
    public string FilePath { get; set; }
     public string FileName { get; set; } // <-- Add this
    public string CourseCode { get; set; }
    public DateTime CreatedAt { get; set; }
  }

  public class CreateAssignmentDto
  {
    public int CourseId { get; set; }
    public string Title { get; set; }
    public IFormFile File { get; set; }
  }

}