using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Student
    {
        public int Id { get; set; }

        // FK to AspNetUsers.Id
        [ForeignKey(nameof(ApplicationUser))]
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public ICollection<Enrollment> Enrollments { get; set; }
        public ICollection<Attendance> AttendanceRecords { get; set; }
        public ICollection<ParentStudent> Parents { get; set; }
    }
}
