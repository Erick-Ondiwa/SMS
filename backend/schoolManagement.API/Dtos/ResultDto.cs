using System;

namespace schoolManagement.API.Dtos
{
    public class ResultDto
    {
        public Guid ResultId { get; set; }

        public string StudentId { get; set; }
        public string AdmissionNumber { get; set; }
        public string StudentFullName { get; set; }
        public int? ProgramId { get; set; }
        public ProgramDto? AcademicProgram { get; set; }  // Optional for display

        public int CourseId { get; set; }
        public string CourseCode { get; set; }
        public string CourseTitle { get; set; }
        public int YearOfStudy { get; set; }
        public int Semester { get; set; }

        public decimal? CATScore { get; set; }
        public decimal? AssignmentScore { get; set; }
        public decimal? ExamScore { get; set; }
        public decimal? TotalScore { get; set; }

        public string Grade { get; set; }
        public string Remarks { get; set; }

        public bool Submitted { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
