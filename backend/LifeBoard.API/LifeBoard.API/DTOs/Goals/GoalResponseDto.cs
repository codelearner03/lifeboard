namespace LifeBoard.API.DTOs.Goals
{
    public class GoalResponseDto
    {
        public uint Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public DateOnly? DueDate { get; set; }
        public Decimal Progress { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

    }
}
