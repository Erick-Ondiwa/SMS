namespace schoolManagement.API.Models.Auth
{
    public class RegisterDto
    {
        public string FullName { get; set; }  // Optional if not storing it separately
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }  // Student, Teacher, Parent
    }
}
