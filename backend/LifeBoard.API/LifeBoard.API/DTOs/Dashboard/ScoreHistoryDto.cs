namespace LifeBoard.API.DTOs.Dashboard
{
    public class ScoreHistoryDto
    {
        public DateOnly Date {  get; set; }
        public decimal Score { get; set; }
        public decimal HabitsPct { get; set; }
        public decimal TasksPct { get; set; }
        public decimal GoalsPct { get; set; }



    }
}
