namespace LifeBoard.API.Models
{
    public class LifeScore
    {
        public uint Id {  get; set; }
        public uint UserId { get; set; }
        public decimal Score {  get; set; } = 0;
        public decimal HabitsPct { get; set; } = 0;
        public decimal TasksPct { get; set; } = 0;
        public decimal GoalsPct { get; set; } = 0;
        public DateOnly ScoreDate { get; set; } 
        public DateTime CreatedAt { get; set; }

        //navegacion
        public User User { get; set; } = null;

    }
}
