using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using schoolManagement.API.Models;

namespace schoolManagement.API.Data
{
    public class SchoolDbContext : IdentityDbContext<ApplicationUser>
    {
        public SchoolDbContext(DbContextOptions<SchoolDbContext> options) : base(options) { }

        // === Core Tables ===
        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<Attendance> Attendances { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Composite Keys
            modelBuilder.Entity<Enrollment>()
                .HasKey(e => new { e.StudentId, e.CourseId });

            modelBuilder.Entity<Attendance>()
                .HasKey(a => new { a.StudentId, a.CourseId, a.Date });

            // === Enrollment Relationships ===
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Student)
                .WithMany(s => s.Enrollments)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(e => e.CourseId)
                .OnDelete(DeleteBehavior.Restrict);

            // === Grade Relationships ===
            modelBuilder.Entity<Grade>()
                .HasOne(g => g.Enrollment)
                .WithMany(e => e.Grades)
                .HasForeignKey(g => new { g.StudentId, g.CourseId })
                .OnDelete(DeleteBehavior.Restrict);

            // === Attendance Relationships ===
            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Student)
                .WithMany(s => s.Attendances)
                .HasForeignKey(a => a.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Course)
                .WithMany(c => c.Attendances)
                .HasForeignKey(a => a.CourseId)
                .OnDelete(DeleteBehavior.Restrict);

            // === Parent ↔ ApplicationUser One-to-One ===
            modelBuilder.Entity<Parent>()
                .HasOne(p => p.ApplicationUser)
                .WithOne(u => u.Parent)
                .HasForeignKey<Parent>(p => p.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Teacher>()
                .HasOne(t => t.ApplicationUser)
                .WithOne(u => u.Teacher)
                .HasForeignKey<Teacher>(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<Student>()
                .HasOne(t => t.ApplicationUser)
                .WithOne(u => u.Student)
                .HasForeignKey<Student>(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);

             modelBuilder.Entity<Admin>()
                .HasOne(a => a.ApplicationUser)
                .WithOne(u => u.Admin)
                .HasForeignKey<Admin>(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict); 

        }
    }
}
