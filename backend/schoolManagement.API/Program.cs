using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using schoolManagement.API.Data;
using schoolManagement.API.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// -------------------- Add Services to the Container --------------------

builder.Services.AddControllers();

// DbContext
builder.Services.AddDbContext<SchoolDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<SchoolDbContext>()
    .AddDefaultTokenProviders();

// Handle API 401/403
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = 403;
        return Task.CompletedTask;
    };
});

// JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };

        options.Events = new JwtBearerEvents
        {
            OnChallenge = context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                return context.Response.WriteAsync("{\"message\": \"Unauthorized\"}");
            }
        };
    });

builder.Services.AddAuthorization();

// Swagger + JWT Auth
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "School Management API", Version = "v1" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' followed by your JWT token."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// -------------------- Configure HTTP Pipeline --------------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// -------------------- Seed Roles and Admin --------------------

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
    var dbContext = services.GetRequiredService<SchoolDbContext>();

    await SeedRolesAsync(roleManager);
    await SeedAdminUserAsync(userManager, roleManager, dbContext);
}

app.Run();

// -------------------- Helpers --------------------

async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
{
    string[] roles = { "Admin", "Teacher", "Student", "Parent" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}

async Task SeedAdminUserAsync(
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole> roleManager,
    SchoolDbContext context)
{
    string adminEmail = "admin@school.com";
    string password = "Admin@123";

    var existingUser = await userManager.FindByEmailAsync(adminEmail);
    if (existingUser == null)
    {
        var adminUser = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            FirstName = "System",
            LastName = "Admin",
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(adminUser, password);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");

            var adminEntity = new Admin
            {
                AdminId = Guid.NewGuid().ToString(),
                UserId = adminUser.Id,
                Department = "System"
            };

            context.Admins.Add(adminEntity);
            await context.SaveChangesAsync();
        }
        else
        {
            Console.WriteLine("Failed to seed admin user:");
            foreach (var error in result.Errors)
                Console.WriteLine($" - {error.Description}");
        }
    }
}



// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.EntityFrameworkCore;

// using Microsoft.OpenApi.Models; 

// using Microsoft.IdentityModel.Tokens;
// using schoolManagement.API.Data;
// using schoolManagement.API.Models;
// using System.Text;

// var builder = WebApplication.CreateBuilder(args);

// // -------------------- Add Services to the Container --------------------

// // Controllers
// builder.Services.AddControllers();

// // DbContext
// builder.Services.AddDbContext<SchoolDbContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// // Identity (User + Role Management)
// builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
//     .AddEntityFrameworkStores<SchoolDbContext>()
//     .AddDefaultTokenProviders();

// // Suppress redirecting to /Account/Login for APIs
// builder.Services.ConfigureApplicationCookie(options =>
// {
//     options.Events.OnRedirectToLogin = context =>
//     {
//         context.Response.StatusCode = 401; // Unauthorized
//         return Task.CompletedTask;
//     };

//     options.Events.OnRedirectToAccessDenied = context =>
//     {
//         context.Response.StatusCode = 403; // Forbidden
//         return Task.CompletedTask;
//     };
// });


// // JWT Authentication
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(options =>
//     {
//         options.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuer = true,
//             ValidateAudience = true,
//             ValidateLifetime = true,
//             ValidateIssuerSigningKey = true,
//             ValidIssuer = builder.Configuration["Jwt:Issuer"],
//             ValidAudience = builder.Configuration["Jwt:Audience"],
//             IssuerSigningKey = new SymmetricSecurityKey(
//                 Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
//             )
//         };

//         // Return 401 JSON instead of redirecting to login
//         options.Events = new JwtBearerEvents
//         {
//             OnChallenge = context =>
//             {
//                 context.HandleResponse();
//                 context.Response.StatusCode = 401;
//                 context.Response.ContentType = "application/json";
//                 return context.Response.WriteAsync("{\"message\": \"Unauthorized\"}");
//             }
//         };
//     });

// // Authorization
// builder.Services.AddAuthorization();

// // Swagger
// builder.Services.AddEndpointsApiExplorer();
// // builder.Services.AddSwaggerGen();

// builder.Services.AddSwaggerGen(options =>
// {
//     options.SwaggerDoc("v1", new OpenApiInfo { Title = "School Management API", Version = "v1" });

//     // Add JWT Authentication to Swagger
//     options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//     {
//         Name = "Authorization",
//         Type = SecuritySchemeType.Http,
//         Scheme = "Bearer",
//         BearerFormat = "JWT",
//         In = ParameterLocation.Header,
//         Description = "Enter 'Bearer' followed by your JWT token. Example: Bearer abc123xyz"
//     });

//     options.AddSecurityRequirement(new OpenApiSecurityRequirement
//     {
//         {
//             new OpenApiSecurityScheme
//             {
//                 Reference = new OpenApiReference
//                 {
//                     Type = ReferenceType.SecurityScheme,
//                     Id = "Bearer"
//                 }
//             },
//             new string[] {}
//         }
//     });
// });

// // CORS (Frontend access)
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowFrontend", policy =>
//     {
//         policy.WithOrigins("http://localhost:5173") // Change if frontend domain changes
//               .AllowAnyHeader()
//               .AllowAnyMethod();
//     });
// });

// var app = builder.Build();

// // -------------------- Configure HTTP Pipeline --------------------

// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseHttpsRedirection();

// app.UseCors("AllowFrontend");

// app.UseAuthentication(); // Authenticate user
// app.UseAuthorization();  // Enforce role-based access

// app.MapControllers();

// // -------------------- Seed Roles on Startup --------------------

// using (var scope = app.Services.CreateScope())
// {
//     var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
//     await SeedRolesAsync(roleManager);
// }

// // -------------------- Run the App --------------------

// app.Run();

// // -------------------- Seed Roles Function --------------------

// async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
// {
//     string[] roles = { "Admin", "Teacher", "Student", "Parent" };

//     foreach (var role in roles)
//     {
//         if (!await roleManager.RoleExistsAsync(role))
//         {
//             await roleManager.CreateAsync(new IdentityRole(role));
//         }
//     }
// }
