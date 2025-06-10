using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using schoolManagement.API.Models;
using System.ComponentModel.DataAnnotations;
using schoolManagement.API.Data;

using System.Security.Claims;

namespace schoolManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SchoolDbContext _context;


        public AdminController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SchoolDbContext context) // <- Inject here
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context; // <- Assign here
        }


        // GET: api/Admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = _userManager.Users.ToList();

            var userList = new List<UserWithRoleDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userList.Add(new UserWithRoleDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Roles = roles.ToList()
                });
            }

            return Ok(userList);
        }

        //[Authorize(Roles = "Admin")]
        // [HttpGet("recent-activities")]
        // public async Task<IActionResult> GetRecentActivities()
        // {
        //     var activities = await _context.AdminActivities
        //         .OrderByDescending(a => a.Timestamp)
        //         .Take(10)
        //         .ToListAsync();

        //     return Ok(activities);
        // }


        [HttpPost("roles")]
        public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            // Ensure the role exists
            if (!await _roleManager.RoleExistsAsync(model.Role))
            {
                var roleResult = await _roleManager.CreateAsync(new IdentityRole(model.Role));
                if (!roleResult.Succeeded)
                    return BadRequest(new { message = "Failed to create role." });
            }

            // Remove existing roles
            var currentRoles = await _userManager.GetRolesAsync(user);
            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded)
                return BadRequest(new { message = "Failed to remove existing roles." });

            // Assign new role
            var addResult = await _userManager.AddToRoleAsync(user, model.Role);
            if (!addResult.Succeeded)
                return BadRequest(new { message = "Failed to assign new role." });

            // === Role-based Table Sync ===
            // Remove user from other role-specific tables
            var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == user.Id);
            if (student != null) _context.Students.Remove(student);

            var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.UserId == user.Id);
            if (teacher != null) _context.Teachers.Remove(teacher);

            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.UserId == user.Id);
            if (admin != null) _context.Admins.Remove(admin);

            var parent = await _context.Parents.FirstOrDefaultAsync(p => p.UserId == user.Id);
            if (parent != null) _context.Parents.Remove(parent);

            // Add to appropriate table based on new role
            switch (model.Role.ToLower())
            {
                case "student":
                    if (student == null)
                        _context.Students.Add(new Student { UserId = user.Id });
                    break;

                case "teacher":
                    if (teacher == null)
                        _context.Teachers.Add(new Teacher { UserId = user.Id });
                    break;

                case "admin":
                    if (admin == null)
                        _context.Admins.Add(new Admin { UserId = user.Id });
                    break;

                case "parent":
                    if (parent == null)
                        _context.Parents.Add(new Parent { UserId = user.Id });
                    break;

                default:
                    return BadRequest(new { message = $"Unsupported role: {model.Role}" });
            }

            // Extract the user performing the action
            // var performedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            //             ?? User.FindFirst("sub")?.Value;

            // // Prepare the activity log
            // var activity = new AdminActivity
            // {
            //     ActivityType = "Role Assigned",
            //     PerformedBy = performedBy,
            //     TargetUser = user.Email,
            //     Description = $"Assigned role '{model.Role}' to {user.Email}.",
            //     Timestamp = DateTime.UtcNow // optional but useful
            // };

            // _context.AdminActivities.Add(activity);

            // // Now save all changes at once
            // await _context.SaveChangesAsync();

            return Ok(new { message = $"Role '{model.Role}' assigned to user '{user.UserName}' successfully." });
        }
    }

    // DTOs

    public class AssignRoleDto
    {
        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty;
    }

    public class UserWithRoleDto
    {
        public string Id { get; set; } = string.Empty;
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public List<string> Roles { get; set; } = new();
    }
}
