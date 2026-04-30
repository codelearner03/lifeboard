using System.Formats.Asn1;

namespace LifeBoard.API.Models
{
    public class Habit
    {
        public uint Id {  get; set; }
        public uint UserId { get; set; }
        public uint? GoalId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Frequency { get; set; } = "daily";
        public string Icon { get; set; } = "star";
        public uint Streak { get; set; } = 0;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        //navegacion
        public User User { get; set; } = null;
        public Goal? Goal { get; set; }
        public ICollection<HabitLog> HabitLogs { get; set; } = new List<HabitLog>();


    }
}
