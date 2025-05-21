using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace schoolManagement.API.Models
{
    public class Parent
    {
        public int Id { get; set; }

        [ForeignKey(nameof(ApplicationUser))]
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public ICollection<ParentStudent> Children { get; set; }
    }
}
