using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Parent
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string ParentId { get; set; }

        //[Required]
        public string? UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public ApplicationUser ApplicationUser { get; set; }

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(100)]
        public string? Occupation { get; set; }

        [MaxLength(255)]
        public string? Address { get; set; }

        [MaxLength(50)]
        public string? RelationshipToStudent { get; set; }  // e.g., Father, Mother, Guardian

        // Navigation property
        public ICollection<Student> Students { get; set; } = new List<Student>();
    }
}
