using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using schoolManagement.API.Data;
using schoolManagement.API.Models;
using schoolManagement.API.Dtos;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace schoolManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Teacher")]
    public class AttendanceController : ControllerBase
    {
        private readonly SchoolDbContext _context;

        public AttendanceController(SchoolDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/attendance/overview/{courseId}
        [HttpGet("overview/{courseId}")]
        public async Task<ActionResult<IEnumerable<AttendanceOverviewDto>>> GetAttendanceOverview(int courseId)
        {
            var enrolledStudents = await _context.Enrollments
                .Include(e => e.Student)
                    .ThenInclude(s => s.ApplicationUser)
                .Where(e => e.CourseId == courseId)
                .ToListAsync();

            var attendanceRecords = await _context.Attendances
                .Where(a => a.CourseId == courseId)
                .ToListAsync();

            var result = new List<AttendanceOverviewDto>();

            foreach (var enrollment in enrolledStudents)
            {
                var student = enrollment.Student;

                var weeklyAttendance = new Dictionary<int, bool?>();

                for (int week = 1; week <= 12; week++)
                {
                    var record = attendanceRecords
                        .FirstOrDefault(a => a.StudentId == student.StudentId && a.Week == week);

                    weeklyAttendance[week] = record?.IsPresent;
                }

                int totalPresent = weeklyAttendance.Count(kvp => kvp.Value == true);
                string remarks = totalPresent >= 10 ? "Good" :
                                 totalPresent >= 6 ? "Fair" : "Poor";

                result.Add(new AttendanceOverviewDto
                {
                    StudentId = student.StudentId,
                    AdmissionNumber = student.AdmissionNumber,
                    FullName = $"{student.ApplicationUser?.FirstName} {student.ApplicationUser?.LastName}".Trim(),
                    Weeks = weeklyAttendance,
                    Remarks = remarks
                });
            }

            return Ok(result);
        }

        // ✅ GET: api/attendance/course/{courseId}/attendance
        [HttpGet("course/{courseId}/attendance")]
        public async Task<ActionResult<IEnumerable<StudentAttendanceDto>>> GetCourseAttendance(int courseId)
        {
            var enrolledStudents = await _context.Enrollments
                .Include(e => e.Student)
                    .ThenInclude(s => s.ApplicationUser)
                .Where(e => e.CourseId == courseId)
                .ToListAsync();

            var attendanceRecords = await _context.Attendances
                .Where(a => a.CourseId == courseId)
                .ToListAsync();

            var result = enrolledStudents.Select(e =>
            {
                var student = e.Student;

                var weekMap = new Dictionary<int, bool?>();

                for (int week = 1; week <= 12; week++)
                {
                    var record = attendanceRecords
                        .FirstOrDefault(a => a.StudentId == student.StudentId && a.Week == week);

                    weekMap[week] = record?.IsPresent;
                }

                return new StudentAttendanceDto
                {
                    StudentId = student.StudentId,
                    AdmissionNumber = student.AdmissionNumber,
                    FullName = $"{student.ApplicationUser?.FirstName} {student.ApplicationUser?.LastName}".Trim(),
                    Weeks = weekMap
                };
            }).ToList();

            return Ok(result);
        }

        // ✅ POST: api/attendance/mark
        [HttpPost("mark")]
        public async Task<IActionResult> MarkAttendance([FromBody] AttendanceSubmissionDto dto)
        {
            foreach (var studentAttendance in dto.Attendance)
            {
                var existing = await _context.Attendances.FirstOrDefaultAsync(a =>
                    a.CourseId == dto.CourseId &&
                    a.Week == dto.Week &&
                    a.StudentId == studentAttendance.StudentId);

                if (existing != null)
                {
                    existing.IsPresent = studentAttendance.IsPresent;
                }
                else
                {
                    _context.Attendances.Add(new Attendance
                    {
                        CourseId = dto.CourseId,
                        StudentId = studentAttendance.StudentId,
                        Week = dto.Week,
                        IsPresent = studentAttendance.IsPresent
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Attendance recorded successfully." });
        }

    }
}
