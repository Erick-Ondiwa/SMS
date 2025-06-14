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
    //[Authorize(Roles = "Admin")]
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
                .Include(s => s.ApplicationUser) // Include related AspNetUsers data
                .AsNoTracking()
                .ToListAsync();

            var studentDtos = students.Select(s => new StudentDto
            {
                StudentId = s.StudentId,
                FullName = $"{s.User?.FirstName} {s.User?.LastName}".Trim(), // Combine names
                AdmissionNumber = s.AdmissionNumber,
                DateOfBirth = s.DateOfBirth,
                Gender = s.Gender,
                EnrollmentDate = s.EnrollmentDate,
                ParentId = s.ParentId,
                Address = s.Address,
                PhoneNumber = s.User?.PhoneNumber ?? s.PhoneNumber, // Prefer phone from User
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
                .Include(s => s.ApplicationUser)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.StudentId.ToString() == id);

            if (student == null) return NotFound();

            var dto = new StudentDto
            {
                StudentId = student.StudentId,
                FullName = $"{student.ApplicationUser?.FirstName} {student.User?.LastName}".Trim(),
                AdmissionNumber = student.AdmissionNumber,
                DateOfBirth = student.DateOfBirth,
                Gender = student.Gender,
                EnrollmentDate = student.EnrollmentDate,
                ParentId = student.ParentId,
                Address = student.Address,
                PhoneNumber = student.ApplicationUser?.PhoneNumber ?? student.PhoneNumber,
                PhotoUrl = student.PhotoUrl,
                UserId = student.UserId
            };

            return Ok(dto);
        }

        // POST: api/students
        [HttpPost]
        public async Task<ActionResult<StudentDto>> CreateStudent(StudentDto dto)
        {
            if (!string.IsNullOrEmpty(dto.AdmissionNumber))
            {
                var exists = await _context.Students.AnyAsync(s => s.AdmissionNumber == dto.AdmissionNumber);
                if (exists)
                    return BadRequest("Admission number already exists.");
            }

            var student = new Student
            {
                StudentId = dto.StudentId,
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

            // Refetch with user info
            var created = await _context.Students.Include(s => s.ApplicationUser)
                .FirstOrDefaultAsync(s => s.StudentId == student.StudentId);

            var result = new StudentDto
            {
                StudentId = created.StudentId,
                FullName = $"{created.ApplicationUser?.FirstName} {created.ApplicationUser?.LastName}".Trim(),
                AdmissionNumber = created.AdmissionNumber,
                DateOfBirth = created.DateOfBirth,
                Gender = created.Gender,
                EnrollmentDate = created.EnrollmentDate,
                ParentId = created.ParentId,
                Address = created.Address,
                PhoneNumber = created.ApplicationUser?.PhoneNumber ?? created.PhoneNumber,
                PhotoUrl = created.PhotoUrl,
                UserId = created.UserId
            };

            return CreatedAtAction(nameof(GetStudent), new { id = result.StudentId }, result);
        }

        // PUT: api/students/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(string id, StudentDto dto)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

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
                .FirstOrDefaultAsync(s => s.StudentId.ToString() == id);

            if (student == null) return NotFound();

            if (student.Enrollments.Any() || student.Attendances.Any())
                return BadRequest("Cannot delete student with associated records.");

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
