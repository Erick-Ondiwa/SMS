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
                .ToListAsync();

            var courseDtos = courses.Select(course => new CourseDto
            {
                CourseId = course.CourseId,
                CourseCode = course.CourseCode,
                Title = course.Title,
                Description = course.Description,
                CreditHours = course.CreditHours,
                Semester = course.Semester,
                Level = course.Level,
                TeacherId = course.TeacherId,
                TeacherName = course.Teacher != null 
                    ? $"{course.Teacher.ApplicationUser.FirstName} {course.Teacher.ApplicationUser.LastName}" 
                    : null,
                Status = course.Status,
                CreatedAt = course.CreatedAt
            });

            return Ok(courseDtos);
        }

        // POST: api/courses
        [HttpPost]
        public async Task<ActionResult<CourseDto>> CreateCourse([FromBody] CourseDto courseDto)
        {
            var newCourse = new Course
            {
                CourseCode = courseDto.CourseCode,
                Title = courseDto.Title,
                Description = courseDto.Description,
                CreditHours = courseDto.CreditHours,
                Semester = courseDto.Semester,
                Level = courseDto.Level,
                TeacherId = courseDto.TeacherId,
                Status = courseDto.Status ?? "Active",
                CreatedAt = DateTime.UtcNow
            };

            _context.Courses.Add(newCourse);
            await _context.SaveChangesAsync();

            var created = await _context.Courses
                .Include(c => c.Teacher)
                    .ThenInclude(t => t.ApplicationUser)
                .FirstOrDefaultAsync(c => c.CourseId == newCourse.CourseId);

            if (created == null) return NotFound("Could not retrieve created course.");

            var result = new CourseDto
            {
                CourseId = created.CourseId,
                CourseCode = created.CourseCode,
                Title = created.Title,
                Description = created.Description,
                CreditHours = created.CreditHours,
                Semester = created.Semester,
                Level = created.Level,
                TeacherId = created.TeacherId,
                TeacherName = created.Teacher != null 
                    ? $"{created.Teacher.ApplicationUser.FirstName} {created.Teacher.ApplicationUser.LastName}" 
                    : null,
                Status = created.Status,
                CreatedAt = created.CreatedAt
            };

            return Ok(result);
        }

        // PUT: api/courses/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] CourseDto courseDto)
        {
            var existing = await _context.Courses.FindAsync(id);
            if (existing == null) return NotFound();

            existing.CourseCode = courseDto.CourseCode;
            existing.Title = courseDto.Title;
            existing.Description = courseDto.Description;
            existing.CreditHours = courseDto.CreditHours;
            existing.Semester = courseDto.Semester;
            existing.Level = courseDto.Level;
            existing.TeacherId = courseDto.TeacherId;
            existing.Status = courseDto.Status;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/courses/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound();

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}


// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using schoolManagement.API.Data;
// using schoolManagement.API.Models;
// using System;
// using System.Linq;
// using System.Threading.Tasks;

// namespace schoolManagement.API.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     [Authorize(Roles = "Admin")]
//     public class CoursesController : ControllerBase
//     {
//         private readonly AppDbContext _context;

//         public CoursesController(AppDbContext context)
//         {
//             _context = context;
//         }

//         // GET: api/courses
//         [HttpGet]
//         public async Task<IActionResult> GetAllCourses()
//         {
//             var courses = await _context.Courses
//                 .Include(c => c.Teacher)
//                 .Select(c => new
//                 {
//                     c.CourseId,
//                     c.CourseCode,
//                     c.Title,
//                     c.Description,
//                     c.CreditHours,
//                     c.Semester,
//                     c.Level,
//                     c.TeacherId,
//                     TeacherName = c.Teacher != null
//                         ? $"{c.Teacher.ApplicationUser.FirstName} {c.Teacher.ApplicationUser.LastName}"
//                         : null,
//                     CreatedAt = EF.Property<DateTime>(c, "CreatedAt")
//                 })
//                 .ToListAsync();

//             return Ok(courses);
//         }

//         // GET: api/courses/{id}
//         [HttpGet("{id}")]
//         public async Task<IActionResult> GetCourse(int id)
//         {
//             var course = await _context.Courses
//                 .Include(c => c.Teacher)
//                 .ThenInclude(t => t.ApplicationUser)
//                 .FirstOrDefaultAsync(c => c.CourseId == id);

//             if (course == null) return NotFound();

//             return Ok(new
//             {
//                 course.CourseId,
//                 course.CourseCode,
//                 course.Title,
//                 course.Description,
//                 course.CreditHours,
//                 course.Semester,
//                 course.Level,
//                 course.TeacherId,
//                 TeacherName = course.Teacher != null
//                     ? $"{course.Teacher.ApplicationUser.FirstName} {course.Teacher.ApplicationUser.LastName}"
//                     : null,
//             });
//         }

//         // POST: api/courses
//         [HttpPost]
//         public async Task<IActionResult> CreateCourse([FromBody] Course course)
//         {
//             if (!ModelState.IsValid) return BadRequest(ModelState);

//             course.CourseCode = course.CourseCode.ToUpper();
//             _context.Courses.Add(course);
//             await _context.SaveChangesAsync();

//             return CreatedAtAction(nameof(GetCourse), new { id = course.CourseId }, course);
//         }

//         // PUT: api/courses/{id}
//         [HttpPut("{id}")]
//         public async Task<IActionResult> UpdateCourse(int id, [FromBody] Course updated)
//         {
//             var existing = await _context.Courses.FindAsync(id);
//             if (existing == null) return NotFound();

//             existing.Title = updated.Title;
//             existing.CourseCode = updated.CourseCode.ToUpper();
//             existing.Description = updated.Description;
//             existing.CreditHours = updated.CreditHours;
//             existing.Semester = updated.Semester;
//             existing.Level = updated.Level;
//             existing.TeacherId = updated.TeacherId;

//             await _context.SaveChangesAsync();
//             return NoContent();
//         }

//         // PATCH: api/courses/{id}/assign-teacher
//         [HttpPatch("{id}/assign-teacher")]
//         public async Task<IActionResult> AssignTeacher(int id, [FromBody] string teacherId)
//         {
//             var course = await _context.Courses.FindAsync(id);
//             if (course == null) return NotFound();

//             course.TeacherId = teacherId;
//             await _context.SaveChangesAsync();
//             return Ok(new { message = "Teacher assigned successfully." });
//         }

//         // PATCH: api/courses/{id}/remove-teacher
//         [HttpPatch("{id}/remove-teacher")]
//         public async Task<IActionResult> RemoveTeacher(int id)
//         {
//             var course = await _context.Courses.FindAsync(id);
//             if (course == null) return NotFound();

//             course.TeacherId = null;
//             await _context.SaveChangesAsync();
//             return Ok(new { message = "Teacher removed successfully." });
//         }

//         // DELETE: api/courses/{id}
//         [HttpDelete("{id}")]
//         public async Task<IActionResult> DeleteCourse(int id)
//         {
//             var course = await _context.Courses.FindAsync(id);
//             if (course == null) return NotFound();

//             _context.Courses.Remove(course);
//             await _context.SaveChangesAsync();
//             return NoContent();
//         }
//     }
// }
