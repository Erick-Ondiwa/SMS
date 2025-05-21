using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Teacher
    {
        public int Id { get; set; }

        [ForeignKey(nameof(ApplicationUser))]
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public ICollection<Course> Courses { get; set; }
    }
}
