namespace schoolManagement.API.Models
{
    public class ParentStudent
    {
        // composite key configured in DbContext
        public int ParentId { get; set; }
        public Parent Parent { get; set; }

        public int StudentId { get; set; }
        public Student Student { get; set; }
    }
}
