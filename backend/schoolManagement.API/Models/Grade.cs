using System;

namespace schoolManagement.API.Models
{
    public class Grade
    {
        public int Id { get; set; }

        // point to Enrollment via composite key
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public Enrollment Enrollment { get; set; }

        public double Score { get; set; }
        public string GradeLetter { get; set; }
        public DateTime DateAwarded { get; set; }
    }
}
