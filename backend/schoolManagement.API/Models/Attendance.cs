using System;

namespace schoolManagement.API.Models
{
    public class Attendance
    {
        // composite key configured in DbContext
        public int StudentId { get; set; }
        public Student Student { get; set; }

        public int CourseId { get; set; }
        public Course Course { get; set; }

        public DateTime Date { get; set; }
        public string Status { get; set; }
    }
}
