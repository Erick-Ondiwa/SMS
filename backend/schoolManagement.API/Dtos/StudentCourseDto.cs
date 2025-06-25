using System.Collections.Generic;
using schoolManagement.API.Dtos;

public class StudentCourseDto
{
    public StudentDto Student { get; set; }
    public List<CourseDto> EnrolledCourses { get; set; }
}
