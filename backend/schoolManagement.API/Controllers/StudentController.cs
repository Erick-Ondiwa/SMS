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

namespace schoolManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class StudentsController : ControllerBase
    {
        private readonly SchoolDbContext _context;

        public StudentsController(SchoolDbContext context)
        {
            _context = context;
        }

        // GET: api/students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetAllStudents()
        {
            var students = await _context.Students
                .AsNoTracking()
                .ToListAsync();

            var studentDtos = students.Select(s => new StudentDto
            {
                StudentId = s.StudentId,
                FullName = s.FullName,
                AdmissionNumber = s.AdmissionNumber,
                DateOfBirth = s.DateOfBirth,
                Gender = s.Gender,
                EnrollmentDate = s.EnrollmentDate,
                ParentId = s.ParentId,
                Address = s.Address,
                PhoneNumber = s.PhoneNumber,
                PhotoUrl = s.PhotoUrl,
                UserId = s.UserId
            }).ToList();

            return Ok(studentDtos);
        }

        // GET: api/students/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentDto>> GetStudent(string id)
        {
            var student = await _context.Students
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.StudentId == id);

            if (student == null) return NotFound();

            var dto = new StudentDto
            {
                StudentId = student.StudentId,
                FullName = student.FullName,
                AdmissionNumber = student.AdmissionNumber,
                DateOfBirth = student.DateOfBirth,
                Gender = student.Gender,
                EnrollmentDate = student.EnrollmentDate,
                ParentId = student.ParentId,
                Address = student.Address,
                PhoneNumber = student.PhoneNumber,
                PhotoUrl = student.PhotoUrl,
                UserId = student.UserId
            };

            return Ok(dto);
        }

        // POST: api/students
        [HttpPost]
        public async Task<ActionResult<StudentDto>> CreateStudent(StudentDto dto)
        {
            // Optional: Ensure AdmissionNumber is unique
            if (!string.IsNullOrEmpty(dto.AdmissionNumber))
            {
                var exists = await _context.Students.AnyAsync(s => s.AdmissionNumber == dto.AdmissionNumber);
                if (exists)
                {
                    return BadRequest("Admission number already exists.");
                }
            }

            var student = new Student
            {
                StudentId = dto.StudentId,
                FullName = dto.FullName,
                AdmissionNumber = dto.AdmissionNumber,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender,
                EnrollmentDate = dto.EnrollmentDate ?? DateTime.UtcNow,
                ParentId = dto.ParentId,
                Address = dto.Address,
                PhoneNumber = dto.PhoneNumber,
                PhotoUrl = dto.PhotoUrl,
                UserId = dto.UserId
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            var result = new StudentDto
            {
                StudentId = student.StudentId,
                FullName = student.FullName,
                AdmissionNumber = student.AdmissionNumber,
                DateOfBirth = student.DateOfBirth,
                Gender = student.Gender,
                EnrollmentDate = student.EnrollmentDate,
                ParentId = student.ParentId,
                Address = student.Address,
                PhoneNumber = student.PhoneNumber,
                PhotoUrl = student.PhotoUrl,
                UserId = student.UserId
            };

            return CreatedAtAction(nameof(GetStudent), new { id = student.StudentId }, result);
        }

        // PUT: api/students/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(string id, StudentDto dto)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            student.FullName = dto.FullName;
            student.AdmissionNumber = dto.AdmissionNumber;
            student.DateOfBirth = dto.DateOfBirth;
            student.Gender = dto.Gender;
            student.EnrollmentDate = dto.EnrollmentDate ?? student.EnrollmentDate;
            student.ParentId = dto.ParentId;
            student.Address = dto.Address;
            student.PhoneNumber = dto.PhoneNumber;
            student.PhotoUrl = dto.PhotoUrl;
            student.UserId = dto.UserId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/students/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(string id)
        {
            var student = await _context.Students
                .Include(s => s.Enrollments)
                .Include(s => s.Attendances)
                .FirstOrDefaultAsync(s => s.StudentId == id);

            if (student == null) return NotFound();

            if (student.Enrollments.Any() || student.Attendances.Any())
            {
                return BadRequest("Cannot delete student with associated records.");
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
