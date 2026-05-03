namespace LifeBoard.API.DTOs.Habits
{
    public class HabitRequestDto
    {
        public string Name { get; set; }  = string.Empty;
        public string? Description { get; set; }
        public string Frequency { get; set; } = "daily";
        public string Icon { get; set; } = "star";

        public uint? GoalId { get; set; }


    }
}
