
using System.Collections.Generic;
using System;

namespace schoolManagement.API.Models
{
    public class Enrollment
    {
        // composite key properties
        public int StudentId { get; set; }
        public int CourseId  { get; set; }

        public DateTime EnrollmentDate { get; set; }

        // navigation back to Student + Course
        public Student Student { get; set; }
        public Course  Course  { get; set; }

        // <<< Add this:
        public ICollection<Grade> Grades { get; set; }
    }
}
