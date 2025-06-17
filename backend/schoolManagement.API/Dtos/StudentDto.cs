using System;
using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Dtos
{
    public class StudentDto
    {
        public string? StudentId { get; set; }

        public string? FullName { get; set; }

        public string? AdmissionNumber { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string? Gender { get; set; }

        public DateTime? EnrollmentDate { get; set; }

        public string? ParentId { get; set; }

        public string? Address { get; set; }

        public string? PhoneNumber { get; set; }

        public string? PhotoUrl { get; set; }

        public string UserId { get; set; } = string.Empty;
    }
}

