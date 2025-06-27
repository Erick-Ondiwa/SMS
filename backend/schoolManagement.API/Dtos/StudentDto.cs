using System;
using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Dtos
{
    public class StudentDto
    {
        public string? StudentId { get; set; }

        // Identity-related fields
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName { get; set; }

        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? Gender { get; set; }
        public DateTime DateOfBirth { get; set; }

        // Academic profile
        public string? AdmissionNumber { get; set; }

        public int? ProgramId { get; set; }             // FK for POST/PUT
        public string? Name { get; set; }       // For display in GET

        public ProgramDto? AcademicProgram { get; set; }


        public int YearOfStudy { get; set; }
        public int Semester { get; set; }
        public DateTime? EnrollmentDate { get; set; }

        // Related info
        public string? ParentId { get; set; }
        public string? PhotoUrl { get; set; }

        public string UserId { get; set; } = string.Empty;
    }
}

