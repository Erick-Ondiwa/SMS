using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using schoolManagement.API.Data;
using schoolManagement.API.Dtos;
using schoolManagement.API.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace schoolManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Teacher")]
    public class AssignmentController : ControllerBase
    {
        private readonly SchoolDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AssignmentController(SchoolDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // POST: api/assignment/upload
        [HttpPost("upload")]
        public async Task<IActionResult> UploadAssignment([FromForm] CreateAssignmentDto dto)
        {
            if (dto.File == null || dto.File.Length == 0)
                return BadRequest("No file uploaded.");

            // Generate a unique file name
            var fileName = $"{Guid.NewGuid()}_{dto.File.FileName}";

            // Define folder path within wwwroot
            var relativeFolder = Path.Combine("uploads", "assignments"); // lowercase for URL match
            var relativePath = Path.Combine(relativeFolder, fileName);   // uploads/assignments/filename
            var fullPath = Path.Combine(_env.WebRootPath!, relativePath); // absolute path for saving

            // Ensure the directory exists
            Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

            // Save the uploaded file
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            // Save assignment to database
            var assignment = new Assignment
            {
                Title = dto.Title,
                CourseId = dto.CourseId,
                FilePath = $"/{relativePath.Replace("\\", "/")}", // use forward slashes for URLs
                CreatedAt = DateTime.UtcNow
            };

            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Assignment uploaded successfully." });
        }

        [HttpGet("my/{userId}")]
        public async Task<ActionResult<IEnumerable<AssignmentDto>>> GetMyAssignments(string userId)
        {
            // Step 1: Get the TeacherId using the userId from AspNetUsers
            var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.UserId == userId);
            if (teacher == null)
                return NotFound("No teacher profile found for this user.");

            var courses = await _context.Courses
                .Where(c => c.TeacherId == teacher.TeacherId)
                .Select(c => c.CourseId)
                .ToListAsync();

            if (!courses.Any())
                return NotFound("No courses found for this teacher.");

            var assignments = await _context.Assignments
                .Where(a => courses.Contains(a.CourseId))
                .Include(a => a.Course)
                .Select(a => new AssignmentDto
                {
                    AssignmentId = a.AssignmentId,
                    Title = a.Title,
                    FilePath = a.FilePath,
                    FileName = Path.GetFileName(a.FilePath),
                    CourseId = a.CourseId,
                    CourseCode = a.Course.CourseCode,
                    CreatedAt = a.CreatedAt
                }).ToListAsync();

            return Ok(assignments);
        }


        // GET: api/assignment/{assignmentId}
        [HttpGet("{assignmentId}")]
        public async Task<ActionResult<AssignmentDto>> GetAssignment(int assignmentId)
        {
            var assignment = await _context.Assignments
                .Include(a => a.Course)
                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (assignment == null)
                return NotFound();

            return Ok(new AssignmentDto
            {
                AssignmentId = assignment.AssignmentId,
                Title = assignment.Title,
                FilePath = assignment.FilePath,
                CourseId = assignment.CourseId,
                CourseCode = assignment.Course.CourseCode,
                CreatedAt = assignment.CreatedAt
            });
        }

        // POST: api/assignment/share/{assignmentId}
        [HttpPost("share/{assignmentId}")]
        public async Task<IActionResult> ShareAssignment(int assignmentId)
        {
            var assignment = await _context.Assignments
                .Include(a => a.Course)
                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (assignment == null)
                return NotFound("Assignment not found.");

            // Get enrolled students
            var students = await _context.Enrollments
                .Where(e => e.CourseId == assignment.CourseId)
                .Select(e => e.StudentId)
                .ToListAsync();

            var sharedList = students.Select(studentId => new SharedAssignment
            {
                AssignmentId = assignmentId,
                StudentId = studentId
            });

            _context.SharedAssignments.AddRange(sharedList);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Assignment shared with students successfully." });
        }

        [HttpGet("student/{userId}")]
        public async Task<ActionResult<IEnumerable<AssignmentDto>>> GetAssignmentsForStudent(string userId)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);
            if (student == null) return NotFound("Student not found.");

            var assignments = await _context.SharedAssignments
                .Where(sa => sa.StudentId == student.StudentId)
                .Include(sa => sa.Assignment)
                    .ThenInclude(a => a.Course)
                .Select(sa => new AssignmentDto
                {
                    AssignmentId = sa.AssignmentId,
                    Title = sa.Assignment.Title,
                    FilePath = sa.Assignment.FilePath,
                    CourseId = sa.Assignment.CourseId,
                    CourseCode = sa.Assignment.Course.CourseCode,
                    CreatedAt = sa.Assignment.CreatedAt
                }).ToListAsync();

            return Ok(assignments);
}


        [HttpDelete("{assignmentId}")]
        public async Task<IActionResult> DeleteAssignment(int assignmentId)
        {
            var assignment = await _context.Assignments.FindAsync(assignmentId);
            if (assignment == null)
            {
                return NotFound(new { message = "Assignment not found." });
            }

            // Construct the full file path
            var filePath = Path.Combine(_env.WebRootPath!, assignment.FilePath.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));

            // Delete file if it exists
            if (System.IO.File.Exists(filePath))
            {
                try
                {
                    System.IO.File.Delete(filePath);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error deleting file.", error = ex.Message });
                }
            }

            // Remove the record from database
            _context.Assignments.Remove(assignment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Assignment deleted successfully." });
        }

    }
}
