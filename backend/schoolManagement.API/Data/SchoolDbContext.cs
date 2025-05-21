using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using schoolManagement.API.Models; // Replace with your actual models namespace

namespace schoolManagement.API.Data
{
    public class SchoolDbContext : IdentityDbContext<ApplicationUser>
    {
        public SchoolDbContext(DbContextOptions<SchoolDbContext> options) : base(options)
        {
        }

        // === Core Tables ===
        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<Attendance> Attendances { get; set; }

        // === Optional Tables ===
        public DbSet<ParentStudent> ParentStudents { get; set; } // For many-to-many parent-child relationships if needed

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Composite Key for Enrollment (Student-Course)
            modelBuilder.Entity<Enrollment>()
                .HasKey(e => new { e.StudentId, e.CourseId });

            // Composite Key for Attendance (Student-Course-Date)
            modelBuilder.Entity<Attendance>()
                .HasKey(a => new { a.StudentId, a.CourseId, a.Date });

            // Composite Key for ParentStudent (if using many-to-many)
            modelBuilder.Entity<ParentStudent>()
                .HasKey(ps => new { ps.ParentId, ps.StudentId });

            // Relationships
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Student)
                .WithMany(s => s.Enrollments)
                .HasForeignKey(e => e.StudentId);

            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(e => e.CourseId);

            modelBuilder.Entity<Grade>()
                .HasOne(g => g.Enrollment)
                .WithMany(e => e.Grades)
                .HasForeignKey(g => new { g.StudentId, g.CourseId });

            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Student)
                .WithMany(s => s.AttendanceRecords)
                .HasForeignKey(a => a.StudentId);

            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Course)
                .WithMany(c => c.AttendanceRecords)
                .HasForeignKey(a => a.CourseId);

            modelBuilder.Entity<ParentStudent>()
                .HasOne(ps => ps.Parent)
                .WithMany(p => p.Children)
                .HasForeignKey(ps => ps.ParentId);

            modelBuilder.Entity<ParentStudent>()
                .HasOne(ps => ps.Student)
                .WithMany(s => s.Parents)
                .HasForeignKey(ps => ps.StudentId);
        }
    }
}
