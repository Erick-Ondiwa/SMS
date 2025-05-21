using Microsoft.AspNetCore.Identity;

namespace schoolManagement.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        // Navigation properties for role-specific data
        public Student Student { get; set; }
        public Teacher Teacher { get; set; }
        public Parent Parent { get; set; }
    }
}
