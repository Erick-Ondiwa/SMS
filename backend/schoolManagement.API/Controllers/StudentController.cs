using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using schoolManagement.API.Data;
using schoolManagement.API.Dtos;
using schoolManagement.API.Models;
using System;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace schoolManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
                .Include(s => s.ApplicationUser)
                .Include(s => s.AcademicProgram) 
                .AsNoTracking()
                .ToListAsync();

            var studentDtos = students.Select(s => new StudentDto
            {
                StudentId = s.StudentId,
                FirstName = s.ApplicationUser?.FirstName,
                LastName = s.ApplicationUser?.LastName,
                FullName = $"{s.ApplicationUser?.FirstName} {s.ApplicationUser?.LastName}".Trim(),
                Email = s.ApplicationUser?.Email ?? s.Email,
                PhoneNumber = s.ApplicationUser?.PhoneNumber ?? s.PhoneNumber,
                Address = s.Address,
                Gender = s.Gender,
                DateOfBirth = s.DateOfBirth,

                AdmissionNumber = s.AdmissionNumber,
                YearOfStudy = s.YearOfStudy,
                Semester = s.Semester,
                EnrollmentDate = s.EnrollmentDate,

                ParentId = s.ParentId,
                PhotoUrl = s.PhotoUrl,
                UserId = s.UserId ?? string.Empty,
                
                AcademicProgram = s.AcademicProgram != null ? new ProgramDto
                {
                    ProgramId = s.AcademicProgram.ProgramId,
                    Name = s.AcademicProgram.Name
                } : null
            }).ToList();

            return Ok(studentDtos);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<StudentDto>> GetStudent(string userId)
        {
            var student = await _context.Students
                .Include(s => s.ApplicationUser)
                .Include(s => s.AcademicProgram)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (student == null) return NotFound();

            var dto = new StudentDto
            {
                StudentId = student.StudentId,
                FirstName = student.ApplicationUser?.FirstName,
                LastName = student.ApplicationUser?.LastName,
                FullName = $"{student.ApplicationUser?.FirstName} {student.ApplicationUser?.LastName}".Trim(),
                Email = student.ApplicationUser?.Email ?? student.Email,
                PhoneNumber = student.ApplicationUser?.PhoneNumber ?? student.PhoneNumber,
                Address = student.Address,
                Gender = student.Gender,
                DateOfBirth = student.DateOfBirth,
                AdmissionNumber = student.AdmissionNumber,
                YearOfStudy = student.YearOfStudy,
                Semester = student.Semester,
                EnrollmentDate = student.EnrollmentDate,
                ParentId = student.ParentId,
                PhotoUrl = student.PhotoUrl,
                UserId = student.UserId ?? string.Empty,
                AcademicProgram = student.AcademicProgram != null ? new ProgramDto
                {
                    ProgramId = student.AcademicProgram.ProgramId,
                    Name = student.AcademicProgram.Name
                } : null
            };

            return Ok(dto);
        }

        // GET: api/students/{studentId}/courses
        [HttpGet("{studentId}/courses")]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetStudentCourses(string studentId)
        {
            var courses = await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Include(e => e.Course)
                .ThenInclude(c => c.Teacher)
                .ThenInclude(t => t.ApplicationUser)
                .Select(e => new CourseDto
                {
                    CourseId = e.Course.CourseId,
                    CourseCode = e.Course.CourseCode,
                    Title = e.Course.Title,
                    Semester = e.Course.Semester,
                    YearOfStudy = e.Course.YearOfStudy,
                    Status = e.Course.Status,
                    CreditHours = e.Course.CreditHours,
                    TeacherId = e.Course.TeacherId,
                    CreatedAt = e.Course.CreatedAt,
                    Teacher = e.Course.Teacher != null ? new TeacherDto
                    {
                        TeacherId = e.Course.Teacher.TeacherId,
                        FullName = e.Course.Teacher.FullName ?? 
                                $"{e.Course.Teacher.ApplicationUser.FirstName} {e.Course.Teacher.ApplicationUser.LastName}".Trim()
                    } : null
                })
                .ToListAsync();

            return courses;
        }

       [HttpGet("my-courses/{userId}")]
        // [Authorize(Roles = "Student")]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetMyCourses(string userId)
        {
            var student = await _context.Students
                .Include(s => s.Enrollments)
                    .ThenInclude(e => e.Course)
                        .ThenInclude(c => c.Teacher)
                .Include(s => s.Enrollments)
                    .ThenInclude(e => e.Course)
                        .ThenInclude(c => c.AcademicProgram)
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (student == null)
                return NotFound("Student not found");

            var enrolledCourses = student.Enrollments.Select(e => new CourseDto
            {
                CourseId = e.Course.CourseId,
                CourseCode = e.Course.CourseCode,
                Title = e.Course.Title,
                Description = e.Course.Description,
                Semester = e.Course.Semester,
                YearOfStudy = e.Course.YearOfStudy,
                CreditHours = e.Course.CreditHours,
                Status = e.Course.Status,
                CreatedAt = e.Course.CreatedAt,
                Teacher = e.Course.Teacher != null ? new TeacherDto
                {
                    TeacherId = e.Course.Teacher.TeacherId,
                    FullName = e.Course.Teacher.FullName
                } : null,
                AcademicProgram = e.Course.AcademicProgram != null ? new ProgramDto
                {
                    ProgramId = e.Course.AcademicProgram.ProgramId,
                    Name = e.Course.AcademicProgram.Name
                } : null
            }).ToList();

            return Ok(enrolledCourses);
        }

        [HttpDelete("{studentId}/courses/{courseId}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveCourseFromStudent(string studentId, int courseId)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == courseId);

            if (enrollment == null) return NotFound("Enrollment not found.");

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<StudentDto>> CreateStudent([FromBody] StudentDto dto)
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
                ParentId = string.IsNullOrEmpty(dto.ParentId) ? null : dto.ParentId,
                Address = dto.Address,
                PhoneNumber = dto.PhoneNumber,
                PhotoUrl = dto.PhotoUrl,
                UserId = dto.UserId,
                YearOfStudy = dto.YearOfStudy,
                Semester = dto.Semester
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            var created = await _context.Students
                .Include(s => s.ApplicationUser)
                .Include(s => s.AcademicProgram) 
                .FirstOrDefaultAsync(s => s.StudentId == student.StudentId);

            var result = new StudentDto
            {
                StudentId = created.StudentId,
                FirstName = created.ApplicationUser?.FirstName,
                LastName = created.ApplicationUser?.LastName,
                FullName = $"{created.ApplicationUser?.FirstName} {created.ApplicationUser?.LastName}".Trim(),
                Email = created.ApplicationUser?.Email ?? created.Email,
                PhoneNumber = created.ApplicationUser?.PhoneNumber ?? created.PhoneNumber,
                Address = created.Address,
                Gender = created.Gender,
                DateOfBirth = created.DateOfBirth,

                AdmissionNumber = created.AdmissionNumber,
                ProgramId = created.ProgramId,           
                Name = created.AcademicProgram?.Name,       
                YearOfStudy = created.YearOfStudy,
                Semester = created.Semester,
                EnrollmentDate = created.EnrollmentDate,

                ParentId = created.ParentId,
                PhotoUrl = created.PhotoUrl,
                UserId = created.UserId ?? string.Empty
            };

            return CreatedAtAction(nameof(GetStudent), new { userId = result.UserId }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(string id, StudentDto dto)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            student.AdmissionNumber = dto.AdmissionNumber;
            student.DateOfBirth = dto.DateOfBirth;
            student.Gender = dto.Gender;
            student.EnrollmentDate = dto.EnrollmentDate ?? student.EnrollmentDate;
            student.ParentId = string.IsNullOrEmpty(dto.ParentId) ? null : dto.ParentId;
            student.Address = dto.Address;
            student.PhoneNumber = dto.PhoneNumber;
            student.PhotoUrl = dto.PhotoUrl;
            student.ProgramId = dto.ProgramId;               // ✅ New
            student.YearOfStudy = dto.YearOfStudy;
            student.Semester = dto.Semester;

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
                return BadRequest("Cannot delete student with associated records.");

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
