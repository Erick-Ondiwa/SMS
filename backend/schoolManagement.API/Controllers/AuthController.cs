using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using schoolManagement.API.Dtos;
using schoolManagement.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using schoolManagement.API.Data;


namespace schoolManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly SchoolDbContext _context;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            SchoolDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
                return BadRequest(new { message = "User already exists!" });

            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                PhoneNumber = model.PhoneNumber,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                var errorMessages = result.Errors.Select(e => e.Description).ToList();
                return BadRequest(new { message = "User creation failed", errors = errorMessages });
            }

            // 🔁 Allow custom role, fallback to "Student"
            var role = string.IsNullOrWhiteSpace(model.Role) ? "Student" : model.Role;

            // Ensure the role exists
            if (!await _roleManager.RoleExistsAsync(role))
                await _roleManager.CreateAsync(new IdentityRole(role));

            await _userManager.AddToRoleAsync(user, role);

            // ✅ Create corresponding role-specific entity
            var fullName = $"{user.FirstName} {user.LastName}".Trim();

            if (role == "Student")
            {
                if (!await _context.Students.AnyAsync(s => s.UserId == user.Id))
                {
                    var student = new Student
                    {
                        UserId = user.Id,
                        FullName = fullName,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber
                    };
                    _context.Students.Add(student);
                }
            }
            else if (role == "Teacher")
            {
                if (!await _context.Teachers.AnyAsync(t => t.UserId == user.Id))
                {
                    var teacher = new Teacher
                    {
                        UserId = user.Id,
                        FullName = fullName,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber
                        // Additional default fields can be set here if needed
                    };
                    _context.Teachers.Add(teacher);
                }
            }

            await _context.SaveChangesAsync();

            var token = await GenerateJwtToken(user);

            return Ok(new
            {
                token,
                userId = user.Id,
                fullName,
                phoneNumber = user.PhoneNumber
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid credentials." });

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded)
                return Unauthorized(new { message = "Invalid credentials." });

            var token = await GenerateJwtToken(user);

            return Ok(new { token });
        }

        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {

            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim("userId", user.Id ?? ""), 
                new Claim("email", user.Email ?? ""),
                new Claim("firstName", user.FirstName ?? ""), // Custom claim
                new Claim("userName", user.UserName ?? ""),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
