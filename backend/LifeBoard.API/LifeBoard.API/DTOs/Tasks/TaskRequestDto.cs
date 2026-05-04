namespace LifeBoard.API.DTOs.Tasks
{
    public class TaskRequestDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = "medium";
        public DateOnly? DueDate { get; set; }
        public uint? GoalId { get; set; }
    }
}