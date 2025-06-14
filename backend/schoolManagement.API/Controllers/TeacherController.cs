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
    public class TeachersController : ControllerBase
    {
        private readonly SchoolDbContext _context;

        public TeachersController(SchoolDbContext context)
        {
            _context = context;
        }

        // GET: api/teachers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeacherDto>>> GetAllTeachers()
        {
            var teachers = await _context.Teachers
                .Include(t => t.ApplicationUser)
                .AsNoTracking()
                .ToListAsync();

            var teacherDtos = teachers.Select(t => new TeacherDto
            {
                TeacherId = t.TeacherId,
                FullName = $"{t.ApplicationUser?.FirstName} {t.ApplicationUser?.LastName}".Trim(),
                Department = t.Department,
                Email = t.Email,
                Address = t.Address,
                PhoneNumber = t.ApplicationUser?.PhoneNumber ?? t.PhoneNumber,
                PhotoUrl = t.PhotoUrl,
                UserId = t.UserId
            }).ToList();

            return Ok(teacherDtos);
        }

        // GET: api/teachers/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TeacherDto>> GetTeacher(string id)
        {
            var teacher = await _context.Teachers
                .Include(t => t.ApplicationUser)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.TeacherId == id);

            if (teacher == null) return NotFound();

            var dto = new TeacherDto
            {
                TeacherId = teacher.TeacherId,
                FullName = $"{teacher.ApplicationUser?.FirstName} {teacher.ApplicationUser?.LastName}".Trim(),
                Department = teacher.Department,
                Email = teacher.Email,
                Address = teacher.Address,
                PhoneNumber = teacher.ApplicationUser?.PhoneNumber ?? teacher.PhoneNumber,
                PhotoUrl = teacher.PhotoUrl,
                UserId = teacher.UserId
            };

            return Ok(dto);
        }

        // POST: api/teachers
        [HttpPost]
        public async Task<ActionResult<TeacherDto>> CreateTeacher(TeacherDto dto)
        {
            var teacher = new Teacher
            {
                TeacherId = Guid.NewGuid().ToString(),
                Department = dto.Department,
                Email = dto.Email,
                Address = dto.Address,
                PhoneNumber = dto.PhoneNumber,
                PhotoUrl = dto.PhotoUrl,
                UserId = dto.UserId
            };

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            var created = await _context.Teachers
                .Include(t => t.ApplicationUser)
                .FirstOrDefaultAsync(t => t.TeacherId == teacher.TeacherId);

            if (created == null) return NotFound("Error retrieving created teacher.");

            var result = new TeacherDto
            {
                TeacherId = created.TeacherId,
                FullName = $"{created.ApplicationUser?.FirstName} {created.ApplicationUser?.LastName}".Trim(),
                Department = created.Department,
                Email = created.Email,
                Address = created.Address,
                PhoneNumber = created.ApplicationUser?.PhoneNumber ?? created.PhoneNumber,
                PhotoUrl = created.PhotoUrl,
                UserId = created.UserId
            };

            return CreatedAtAction(nameof(GetTeacher), new { id = result.TeacherId }, result);
        }

        // PUT: api/teachers/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeacher(string id, TeacherDto dto)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound();

            teacher.Email = dto.Email;
            teacher.Department = dto.Department;
            teacher.Address = dto.Address;
            teacher.PhoneNumber = dto.PhoneNumber;
            teacher.PhotoUrl = dto.PhotoUrl;
            teacher.UserId = dto.UserId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/teachers/{id}
        [HttpDelete("{id}")]
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
