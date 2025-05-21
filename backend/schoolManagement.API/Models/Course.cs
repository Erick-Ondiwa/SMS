using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; }

        // FK to Teacher.Id
        public int TeacherId { get; set; }
        public Teacher Teacher { get; set; }

        public ICollection<Enrollment> Enrollments { get; set; }
        public ICollection<Attendance> AttendanceRecords { get; set; }
    }
}
