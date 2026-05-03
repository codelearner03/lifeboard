namespace LifeBoard.API.DTOs.Habits
{
    public class HabitResponseDto
    {
        public uint Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Frequency { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public uint Streak { get; set; }
        public uint? GoalId { get; set; }
        public string? GoalTitle { get; set; }
        public bool CompletedToday { get; set; }
        public DateTime CreatedAt { get; set; }



    }
}
