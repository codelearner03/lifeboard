namespace LifeBoard.API.DTOs.Goals
{
    public class GoalRequestDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public DateOnly DueDate { get; set; }

    }
}
