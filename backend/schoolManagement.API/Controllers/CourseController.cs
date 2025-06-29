using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using schoolManagement.API.Data;
using schoolManagement.API.Dtos;
using schoolManagement.API.Models;

namespace schoolManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class CoursesController : ControllerBase
    {
        private readonly SchoolDbContext _context;

        public CoursesController(SchoolDbContext context)
        {
            _context = context;
        }

        // GET: api/courses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetCourses()
        {
            var courses = await _context.Courses
                .Include(c => c.Teacher)
                    .ThenInclude(t => t.ApplicationUser)
                .Include(c => c.AcademicProgram)
                .ToListAsync();

            // Inside GET: api/courses
            return courses.Select(c => new CourseDto
            {
                CourseId = c.CourseId,
                CourseCode = c.CourseCode,
                Title = c.Title,
                Description = c.Description,
                Level = c.Level,
                Semester = c.Semester,
                Status = c.Status,
                CreditHours = c.CreditHours,
                TeacherId = c.TeacherId,
                CreatedAt = c.CreatedAt,
                ProgramId = c.ProgramId, 
                AcademicProgram = c.AcademicProgram != null ? new ProgramDto
                {
                    ProgramId = c.AcademicProgram.ProgramId,
                    Name = c.AcademicProgram.Name,
                    Category = c.AcademicProgram.Category,
                    DurationInYears = c.AcademicProgram.DurationInYears
                } : null,
                Teacher = c.Teacher != null ? new TeacherDto
                {
                    TeacherId = c.Teacher.TeacherId,
                    FullName = c.Teacher.FullName ?? $"{c.Teacher.ApplicationUser?.FirstName} {c.Teacher.ApplicationUser?.LastName}".Trim()
                } : null
            }).ToList();

        }

        // GET: api/courses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CourseDto>> GetCourse(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Teacher).ThenInclude(t => t.ApplicationUser)
                .FirstOrDefaultAsync(c => c.CourseId == id);

            if (course == null) return NotFound();

            // Inside GET: api/courses/{id}
            return new CourseDto
            {
                CourseId = course.CourseId,
                CourseCode = course.CourseCode,
                Title = course.Title,
                Description = course.Description,
                Semester = course.Semester,
                Level = course.Level,
                Status = course.Status,
                CreditHours = course.CreditHours,
                TeacherId = course.TeacherId,
                CreatedAt = course.CreatedAt,
                ProgramId = course.ProgramId, // ✅ NEW
                AcademicProgram = await _context.AcademicPrograms
                    .Where(p => p.ProgramId == course.ProgramId)
                    .Select(p => new ProgramDto
                    {
                        ProgramId = p.ProgramId,
                        Name = p.Name,
                        Category = p.Category,
                        DurationInYears = p.DurationInYears
                    }).FirstOrDefaultAsync(), // ✅ NEW
                Teacher = course.Teacher != null ? new TeacherDto
                {
                    TeacherId = course.Teacher.TeacherId,
                    FullName = course.Teacher.FullName ?? $"{course.Teacher.ApplicationUser?.FirstName} {course.Teacher.ApplicationUser?.LastName}".Trim()
                } : null
            };

        }

        // POST: api/courses
        [HttpPost]
        public async Task<ActionResult<CourseDto>> PostCourse([FromBody] CourseDto dto)
        {
            var course = new Course
            {
                CourseCode = dto.CourseCode,
                Title = dto.Title,
                Description = dto.Description,
                Semester = dto.Semester,
                Level = dto.Level,
                Status = dto.Status,
                CreditHours = dto.CreditHours,
                TeacherId = dto.TeacherId,
                ProgramId = dto.ProgramId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCourse), new { id = course.CourseId }, dto);
        }

        // PUT: api/courses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourse(int id, [FromBody] CourseDto dto)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound();

            course.CourseCode = dto.CourseCode;
            course.Title = dto.Title;
            course.Description = dto.Description;
            course.Semester = dto.Semester;
            course.Level = dto.Level;
            course.Status = dto.Status;
            course.CreditHours = dto.CreditHours;
            course.ProgramId = dto.ProgramId;
            course.TeacherId = dto.TeacherId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/courses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound();

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/courses/5/enroll
        [HttpPost("{courseId}/enroll")]
        public async Task<IActionResult> EnrollStudent(int courseId, [FromBody] EnrollRequest request)
        {
            var exists = await _context.Enrollments
                .AnyAsync(e => e.CourseId == courseId && e.StudentId == request.StudentId);

            if (exists)
                return BadRequest("Student is already enrolled.");

            var enrollment = new Enrollment
            {
                CourseId = courseId,
                StudentId = request.StudentId,
                EnrollmentDate = DateTime.UtcNow
            };

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/courses/5/unenroll/student123
        [HttpDelete("{courseId}/unenroll/{studentId}")]
        public async Task<IActionResult> UnenrollStudent(int courseId, string studentId)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.CourseId == courseId && e.StudentId == studentId);

            if (enrollment == null) return NotFound();

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // GET: api/courses/5/enrollments
        [HttpGet("{courseId}/enrollments")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetEnrolledStudents(int courseId)
        {
            var students = await _context.Enrollments
                .Where(e => e.CourseId == courseId)
                .Include(e => e.Student)
                    .ThenInclude(s => s.ApplicationUser)
                .Select(e => new StudentDto
                {
                    StudentId = e.StudentId,
                    FirstName = e.Student.ApplicationUser.FirstName,
                    LastName = e.Student.ApplicationUser.LastName,
                    Email = e.Student.ApplicationUser.Email,
                    YearOfStudy = e.Student.YearOfStudy,
                    AdmissionNumber = e.Student.AdmissionNumber
                })
                .ToListAsync();

            return students;
        }
    }

    // Additional request DTO
    public class EnrollRequest
    {
        public string StudentId { get; set; }
    }
}
