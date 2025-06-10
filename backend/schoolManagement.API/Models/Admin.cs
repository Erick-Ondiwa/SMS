using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
   public class Admin
  {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string AdminId { get; set; }

    [Required]
    public string? UserId { get; set; }
    public ApplicationUser? ApplicationUser { get; set; }

    public string? Department { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Optional navigation properties
    public ICollection<Teacher> ManagedTeachers { get; set; }
    public ICollection<Student> ManagedStudents { get; set; }
  }

}
