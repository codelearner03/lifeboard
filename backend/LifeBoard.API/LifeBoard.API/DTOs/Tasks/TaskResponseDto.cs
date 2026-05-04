namespace LifeBoard.API.DTOs.Tasks
{
    public class TaskResponseDto
    {
        public uint Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateOnly? DueDate { get; set; }
        public bool IsOverdue { get; set; }
        public uint? GoalId { get; set; }
        public string? GoalTitle { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}