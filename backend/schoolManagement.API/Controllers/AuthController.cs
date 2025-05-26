using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using schoolManagement.API.Dtos;
using schoolManagement.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace schoolManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
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
                Role = model.Role,
                FirstName = model.FirstName,
                LastName = model.LastName,
                PhoneNumber = model.PhoneNumber,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest(new { message = "User creation failed", errors = result.Errors });

            // Ensure role exists
            if (!await _roleManager.RoleExistsAsync(model.Role))
                await _roleManager.CreateAsync(new IdentityRole(model.Role));

            // Assign role
            await _userManager.AddToRoleAsync(user, model.Role);

            // Generate JWT
            var token = await GenerateJwtToken(user);

            return Ok(new { token });
        }

        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Name, user.UserName ?? ""),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Add role claims
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
                expires: DateTime.Now.AddHours(6),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}


// using Microsoft.AspNetCore.Identity;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.IdentityModel.Tokens;
// using schoolManagement.API.Models.Auth;
// using System.IdentityModel.Tokens.Jwt;
// using System.Security.Claims;
// using System.Text;

// namespace schoolManagement.API.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class AuthController : ControllerBase
//     {
//         private readonly UserManager<IdentityUser> _userManager;
//         private readonly RoleManager<IdentityRole> _roleManager;
//         private readonly IConfiguration _configuration;

//         public AuthController(
//             UserManager<IdentityUser> userManager,
//             RoleManager<IdentityRole> roleManager,
//             IConfiguration configuration)
//         {
//             _userManager = userManager;
//             _roleManager = roleManager;
//             _configuration = configuration;
//         }

//         [HttpPost("register")]
//         public async Task<IActionResult> Register(RegisterDto model)
//         {
//             var userExists = await _userManager.FindByEmailAsync(model.Email);
//             if (userExists != null)
//                 return BadRequest(new { message = "User already exists!" });

//             var user = new IdentityUser
//             {
//                 UserName = model.Email,
//                 Email = model.Email,
//                 Role = model.Role
//             };

//             var result = await _userManager.CreateAsync(user, model.Password);

//             if (!result.Succeeded)
//                 return BadRequest(new { message = "User creation failed", errors = result.Errors });

//             // Add role
//             if (await _roleManager.RoleExistsAsync(model.Role))
//             {
//                 await _userManager.AddToRoleAsync(user, model.Role);
//             }

//             // Generate JWT
//             var token = await GenerateJwtToken(user, model.Role);

//             return Ok(new { token });
//         }

//         private async Task<string> GenerateJwtToken(IdentityUser user, string role)
//         {
//             var authClaims = new List<Claim>
//             {
//                 new Claim(ClaimTypes.NameIdentifier, user.Id),
//                 new Claim(ClaimTypes.Email, user.Email!),
//                 new Claim(ClaimTypes.Role, role),
//                 new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
//             };

//             var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
//             var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//             var token = new JwtSecurityToken(
//                 issuer: _configuration["Jwt:Issuer"],
//                 audience: _configuration["Jwt:Audience"],
//                 claims: authClaims,
//                 expires: DateTime.Now.AddHours(6),
//                 signingCredentials: creds
//             );

//             return new JwtSecurityTokenHandler().WriteToken(token);
//         }
//     }
// }
