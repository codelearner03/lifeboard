namespace LifeBoard.API.DTOs.Dashboard
{
    public class DashboardSummaryDto
    {
        public decimal LifeScore { get; set; }
        public int TotalHabits { get; set; }
        public int CompletedHabitsToday { get; set; }
        public int PendingTasks { get; set; }
        public int ActiveGoals { get; set; }
        public List<GoalProgressDto> GoalProgress { get; set; } = new();
        public TaskDistributionDto TaskDistribution { get; set; } = new();
    }

    public class GoalProgressDto
    {
        public string Title { get; set; } = string.Empty;
        public decimal Progress { get; set; }
        public string Category { get; set; } = string.Empty;
    }

    public class TaskDistributionDto
    {
        public int Pending { get; set; }
        public int InProgress { get; set; }
        public int Completed { get; set; }
    }
}