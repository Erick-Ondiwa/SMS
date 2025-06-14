using System;
using System.ComponentModel.DataAnnotations;

namespace schoolManagement.API.Dtos
{
    public class StudentDto
    {
        public string? StudentId { get; set; } // Optional, for update scenarios

        // [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

           // ⬇️ These should be mapped from the linked AspNetUser
        public string FirstName { get; set; }
        public string LastName { get; set; }

        [Required]
        [MaxLength(50)]
        public string AdmissionNumber { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [MaxLength(10)]
        public string Gender { get; set; }

        public DateTime? EnrollmentDate { get; set; } // Optional on create, default can be used

        public string ParentId { get; set; }

        [MaxLength(255)]
        public string Address { get; set; }

        [MaxLength(20)]
        public string PhoneNumber { get; set; }

        public string PhotoUrl { get; set; }

        public string UserId { get; set; } // Needed for Identity link, only required if student has account
    }
}
