namespace schoolManagement.API.Dtos
{
    public class RegisterDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }  // plain password
        public string Role { get; set; }      // e.g., "Student"
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
    }
}

