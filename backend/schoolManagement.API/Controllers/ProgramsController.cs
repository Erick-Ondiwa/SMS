using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using schoolManagement.API.Data;
using schoolManagement.API.Dtos;
using schoolManagement.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace schoolManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProgramsController : ControllerBase
    {
        private readonly SchoolDbContext _context;

        public ProgramsController(SchoolDbContext context)
        {
            _context = context;
        }

        // GET: api/programs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProgramDto>>> GetAllPrograms()
        {
            var programs = await _context.AcademicPrograms.AsNoTracking().ToListAsync();

            var programDtos = programs.Select(p => new ProgramDto
            {
                ProgramId = p.ProgramId,
                Name = p.Name,
                Category = p.Category,
                DurationInYears = p.DurationInYears,
                Description = p.Description
            }).ToList();

            return Ok(programDtos);
        }

        // GET: api/programs/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProgramDto>> GetProgram(int id)
        {
            var program = await _context.AcademicPrograms.FindAsync(id);
            if (program == null)
                return NotFound();

            var dto = new ProgramDto
            {
                ProgramId = program.ProgramId,
                Name = program.Name,
                Category = program.Category,
                DurationInYears = program.DurationInYears,
                Description = program.Description
            };

            return Ok(dto);
        }

        // POST: api/programs
        [HttpPost]
        public async Task<ActionResult<ProgramDto>> CreateProgram([FromBody] ProgramDto dto)
        {
            var exists = await _context.AcademicPrograms.AnyAsync(p => p.Name == dto.Name);
            if (exists)
                return BadRequest("A program with this name already exists.");

            var program = new AcademicProgram
            {
                Name = dto.Name,
                Category = dto.Category,
                DurationInYears = dto.DurationInYears,
                Description = dto.Description
            };

            _context.AcademicPrograms.Add(program);
            await _context.SaveChangesAsync();

            dto.ProgramId = program.ProgramId;

            return CreatedAtAction(nameof(GetProgram), new { id = dto.ProgramId }, dto);
        }

        // PUT: api/programs/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProgram(int id, [FromBody] ProgramDto dto)
        {
            var program = await _context.AcademicPrograms.FindAsync(id);
            if (program == null)
                return NotFound();

            program.Name = dto.Name;
            program.Category = dto.Category;
            program.DurationInYears = dto.DurationInYears;
            program.Description = dto.Description;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/programs/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProgram(int id)
        {
            var program = await _context.AcademicPrograms
                .Include(p => p.Students)
                .FirstOrDefaultAsync(p => p.ProgramId == id);

            if (program == null)
                return NotFound();

            if (program.Students.Any())
                return BadRequest("Cannot delete a program that has enrolled students.");

            _context.AcademicPrograms.Remove(program);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
