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
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Teacher")]
    public class ResultsController : ControllerBase
    {
        private readonly SchoolDbContext _context;

        public ResultsController(SchoolDbContext context)
        {
            _context = context;
        }

        // GET: api/results/course/5
        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<IEnumerable<ResultDto>>> GetResultsByCourse(int courseId)
        {
            var results = await _context.Results
                .Include(r => r.Student)
                .Include(r => r.Course)
                .Where(r => r.CourseId == courseId)
                .Select(r => new ResultDto
                {
                    ResultId = r.ResultId,
                    StudentId = r.StudentId,
                    AdmissionNumber = r.Student.AdmissionNumber,
                    StudentFullName = r.Student.ApplicationUser.FirstName + " " + r.Student.ApplicationUser.LastName,
                    CourseId = r.CourseId,
                    CourseCode = r.Course.CourseCode,
                    CourseTitle = r.Course.Title,
                    CATScore = r.CATScore,
                    AssignmentScore = r.AssignmentScore,
                    ExamScore = r.ExamScore,
                    TotalScore = r.TotalScore,
                    Grade = r.Grade,
                    Remarks = r.Remarks,
                    Submitted = r.Submitted,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(results);
        }

        // POST: api/results
        [HttpPost]
        public async Task<IActionResult> SubmitResults([FromBody] List<CreateResultDto> results)
        {
            if (results == null || !results.Any())
                return BadRequest("No results submitted.");

            foreach (var dto in results)
            {
                var total = dto.CATScore + dto.AssignmentScore + dto.ExamScore;
                var grade = CalculateGrade(total);
                var remarks = GenerateRemarks(grade);

                var result = new Result
                {
                    ResultId = Guid.NewGuid(),
                    StudentId = dto.StudentId,
                    CourseId = dto.CourseId,
                    CATScore = dto.CATScore,
                    AssignmentScore = dto.AssignmentScore,
                    ExamScore = dto.ExamScore,
                    TotalScore = total,
                    Grade = grade,
                    Remarks = remarks,
                    Submitted = false,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Results.Add(result);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Results submitted successfully." });
        }

        // PUT: api/results
        [HttpPut]
        public async Task<ActionResult> UpdateResult(UpdateResultDto dto)
        {
            var result = await _context.Results.FindAsync(dto.ResultId);
            if (result == null)
                return NotFound("Result not found.");

            result.CATScore = dto.CATScore;
            result.AssignmentScore = dto.AssignmentScore;
            result.ExamScore = dto.ExamScore;
            result.TotalScore = dto.CATScore + dto.AssignmentScore + dto.ExamScore;
            result.Grade = CalculateGrade(result.TotalScore);
            result.Remarks = GenerateRemarks(result.Grade);
            result.Submitted = dto.Submitted;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Result updated successfully." });
        }

        private string CalculateGrade(decimal? total)
        {
            if (total == null) return "N/A";

            return total switch
            {
                >= 70 => "A",
                >= 60 => "B",
                >= 50 => "C",
                >= 40 => "D",
                _ => "F"
            };
        }

        private string GenerateRemarks(string grade)
        {
            return grade switch
            {
                "A" => "Excellent",
                "B" => "Good",
                "C" => "Fair",
                "D" => "Poor",
                "F" => "Fail",
                _ => "N/A"
            };
        }
    }
}
