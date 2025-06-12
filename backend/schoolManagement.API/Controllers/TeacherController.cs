using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using schoolManagement.API.Data;
using schoolManagement.API.DTOs;
using schoolManagement.API.Models;

namespace schoolManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeachersController : ControllerBase
    {
        private readonly SchoolDbContext _context;

        public TeachersController(SchoolDbContext context)
        {
            _context = context;
        }

        // GET: api/teachers
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TeacherDto>>> GetTeachers()
        {
            var teachers = await _context.Teachers
                .Select(t => new TeacherDto
                {
                    TeacherId = t.TeacherId,
                    FullName = t.FullName,
                    Email = t.Email,
                    PhoneNumber = t.PhoneNumber,
                    Department = t.Department,
                    Address = t.Address,
                    PhotoUrl = t.PhotoUrl
                })
                .ToListAsync();

            return Ok(teachers);
        }

        // GET: api/teachers/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<TeacherDto>> GetTeacher(string id)
        {
            var teacher = await _context.Teachers.FindAsync(id);

            if (teacher == null)
                return NotFound();

            var dto = new TeacherDto
            {
                TeacherId = teacher.TeacherId,
                FullName = teacher.FullName,
                Email = teacher.Email,
                PhoneNumber = teacher.PhoneNumber,
                Department = teacher.Department,
                Address = teacher.Address,
                PhotoUrl = teacher.PhotoUrl
            };

            return Ok(dto);
        }

        // POST: api/teachers
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<TeacherDto>> CreateTeacher(TeacherDto dto)
        {
            var teacher = new Teacher
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Department = dto.Department,
                Address = dto.Address,
                PhotoUrl = dto.PhotoUrl
            };

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            dto.TeacherId = teacher.TeacherId;

            return CreatedAtAction(nameof(GetTeacher), new { id = teacher.TeacherId }, dto);
        }

        // PUT: api/teachers/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTeacher(string id, TeacherDto dto)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound();

            teacher.FullName = dto.FullName;
            teacher.Email = dto.Email;
            teacher.PhoneNumber = dto.PhoneNumber;
            teacher.Department = dto.Department;
            teacher.Address = dto.Address;
            teacher.PhotoUrl = dto.PhotoUrl;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/teachers/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTeacher(string id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound();

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
