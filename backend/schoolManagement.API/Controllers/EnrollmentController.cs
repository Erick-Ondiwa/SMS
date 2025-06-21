using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using schoolManagement.API.Data;
using schoolManagement.API.Dtos;
using schoolManagement.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/enrollments")]
public class EnrollmentController : ControllerBase
{
    private readonly SchoolDbContext _context;

    public EnrollmentController(SchoolDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> EnrollStudent([FromBody] EnrollmentDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var exists = await _context.Enrollments
            .AnyAsync(e => e.StudentId == dto.StudentId && e.CourseId == dto.CourseId);

        if (exists) return Conflict("Student is already enrolled in this course.");

        var enrollment = new Enrollment
        {
            StudentId = dto.StudentId,
            CourseId = dto.CourseId
        };

        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();

        return Ok(enrollment);
    }

    [HttpGet("course/{courseId}")]
    public async Task<IActionResult> GetEnrolledStudents(int courseId)
    {
        var students = await _context.Enrollments
            .Where(e => e.CourseId == courseId)
            .Include(e => e.Student)
                .ThenInclude(s => s.ApplicationUser)
            .Select(e => new
            {
                e.StudentId,
                FullName = $"{e.Student.ApplicationUser.FirstName} {e.Student.ApplicationUser.LastName}",
                e.EnrollmentDate
            })
            .ToListAsync();

        return Ok(students);
    }
}
