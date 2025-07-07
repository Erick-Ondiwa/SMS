using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using schoolManagement.API.Models;

namespace schoolManagement.API.Data
{
    public class SchoolDbContext : IdentityDbContext<ApplicationUser>
    {
        public SchoolDbContext(DbContextOptions<SchoolDbContext> options) : base(options) {}

        // DbSets
        public DbSet<Student> Students { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<SharedAssignment> SharedAssignments { get; set; }
        public DbSet<AdminActivity> AdminActivities { get; set; }

        public DbSet<AcademicProgram> AcademicPrograms { get; set; } // ✅ ADDED

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // IdentityUser one-to-one relationships
            modelBuilder.Entity<ApplicationUser>()
                .HasOne(u => u.Student)
                .WithOne(s => s.ApplicationUser)
                .HasForeignKey<Student>(s => s.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ApplicationUser>()
                .HasOne(u => u.Teacher)
                .WithOne(t => t.ApplicationUser)
                .HasForeignKey<Teacher>(t => t.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ApplicationUser>()
                .HasOne(u => u.Parent)
                .WithOne(p => p.ApplicationUser)
                .HasForeignKey<Parent>(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ApplicationUser>()
                .HasOne(u => u.Admin)
                .WithOne(a => a.ApplicationUser)
                .HasForeignKey<Admin>(a => a.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Enrollment: Student-Course (many-to-one)
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Student)
                .WithMany(s => s.Enrollments)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(e => e.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Assignment:
            modelBuilder.Entity<Assignment>()
                .HasOne(a => a.Course)
                .WithMany(c => c.Assignments)
                .HasForeignKey(a => a.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Grade mapping to Enrollment (optional FK)
            modelBuilder.Entity<Grade>()
                .HasOne(g => g.Enrollment)
                .WithMany(e => e.Grades)
                .HasForeignKey(g => new { g.StudentId, g.CourseId })
                .HasPrincipalKey(e => new { e.StudentId, e.CourseId })
                .OnDelete(DeleteBehavior.Restrict);

            // Attendance
            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Student)
                .WithMany(s => s.Attendances)
                .HasForeignKey(a => a.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Course)
                .WithMany(c => c.Attendances)
                .HasForeignKey(a => a.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Course - Teacher
            modelBuilder.Entity<Course>()
                .HasOne(c => c.Teacher)
                .WithMany(t => t.Courses)
                .HasForeignKey(c => c.TeacherId)
                .OnDelete(DeleteBehavior.SetNull);

            // Student - Parent
            modelBuilder.Entity<Student>()
                .HasOne(s => s.Parent)
                .WithMany(p => p.Students)
                .HasForeignKey(s => s.ParentId)
                .OnDelete(DeleteBehavior.SetNull);

            // ✅ Course - Program
            modelBuilder.Entity<Course>()
                .HasOne(c => c.AcademicProgram)
                .WithMany(p => p.Courses)
                .HasForeignKey(c => c.ProgramId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ Student - Program
            modelBuilder.Entity<Student>()
                .HasOne(s => s.AcademicProgram)
                .WithMany(p => p.Students)
                .HasForeignKey(s => s.ProgramId)
                .OnDelete(DeleteBehavior.SetNull);

            // Admin - ApplicationUser
            modelBuilder.Entity<Admin>()
                .HasOne(a => a.ApplicationUser)
                .WithOne(u => u.Admin)
                .HasForeignKey<Admin>(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

