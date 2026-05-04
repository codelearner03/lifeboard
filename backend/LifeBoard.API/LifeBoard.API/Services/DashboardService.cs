using LifeBoard.API.Data;
using LifeBoard.API.DTOs.Dashboard;
using LifeBoard.API.Models;
using LifeBoard.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace LifeBoard.API.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }
        //SUMMARY
        public async Task<DashboardSummaryDto> GetSummaryAsync(uint userId)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            //calculate score
            await CalculateLifeScoreAsync(userId);

            //Score Day
            var lifeScore = await _context.LifeScores
                .Where(ls => ls.UserId == userId && ls.ScoreDate == today)
                .Select(ls => ls.Score)
                .FirstOrDefaultAsync();

            //habit
            var totalHabits = await _context.Habits
                .CountAsync(h => h.UserId == userId);
            var completedToday = await _context.HabitLogs
                .CountAsync(hl => hl.Habit.UserId ==  userId && hl.LogDate == today && hl.Completed);

            //tasks
            var pendingTasks = await _context.Tasks
                .CountAsync(t => t.UserId == userId && t.Status == "pending");

            //active goals
            var activeGoals = await _context.Goals
                .CountAsync(g => g.UserId == userId && g.Status ==  "active");

            //Goal progress for the insight
            var goalProgress = await _context.Goals
                .Where(g => g.UserId == userId && g.Status == "active")
                .Select(g => new GoalProgressDto
                {
                    Title = g.Title,
                    Progress = g.Progress,
                    Category = g.Category,
                })
                .ToListAsync();
            
            
            //tasks distribution for donut graphic
            var tasks = await _context.Tasks
                .Where(t => t.UserId == userId)
                .ToListAsync();

            var distribution = new TaskDistributionDto
            {
                Pending = tasks.Count(t => t.Status == "pending"),
                InProgress = tasks.Count(t => t.Status == "in_progress"),  
                Completed = tasks.Count(t => t.Status == "completed")
            };


            return new DashboardSummaryDto
            {
                LifeScore = lifeScore,
                TotalHabits = totalHabits,
                CompletedHabitsToday = completedToday,
                PendingTasks = pendingTasks,
                ActiveGoals = activeGoals,
                GoalProgress = goalProgress,
                TaskDistribution = distribution
            };
        }

        //INSIGHTS
        public async Task<List<InsightDto>> GetInsightsAsync(uint userId)
        {
            var insights = new List<InsightDto>();
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            // ── Insight 1: Mejor día de la semana ────────────
            var logs = await _context.HabitLogs
                .Where(hl => hl.Habit.UserId == userId
                        && hl.LogDate >= today.AddDays(-30))
                .ToListAsync();

            if (logs.Any())
            {
                var bestDay = logs
                    .GroupBy(hl => hl.LogDate.DayOfWeek)
                    .OrderByDescending(g => g.Count())
                    .First();

                insights.Add(new InsightDto
                {
                    Type = "best_day",
                    Message = $"You complete more habits on {bestDay.Key}s — your most productive day!",
                    Icon = "trophy"
                });
            }

            // ── Insight 2: Hábito en riesgo ──────────────────
            var habits = await _context.Habits
                .Where(h => h.UserId == userId)
                .Include(h => h.HabitLogs)
                .ToListAsync();

            var riskyHabits = habits.Where(h =>
                !h.HabitLogs.Any(hl => hl.LogDate >= today.AddDays(-3))
            ).ToList();

            if (riskyHabits.Any())
            {
                var names = string.Join(", ", riskyHabits.Take(2).Select(h => h.Name));
                insights.Add(new InsightDto
                {
                    Type = "habit_at_risk",
                    Message = $"You haven't logged '{names}' in 3+ days. Don't break the streak!",
                    Icon = "warning"
                });
            }

            // ── Insight 3: Meta sin avance ───────────────────
            var sevenDaysAgo = today.AddDays(-7);

            var stuckGoals = await _context.Goals
                .Where(g => g.UserId == userId
                        && g.Status == "active"
                        && g.UpdatedAt < DateTime.UtcNow.AddDays(-7))
                .ToListAsync();

            if (stuckGoals.Any())
            {
                var goalName = stuckGoals.First().Title;
                insights.Add(new InsightDto
                {
                    Type = "stuck_goal",
                    Message = $"'{goalName}' hasn't progressed in 7 days. Time to take action!",
                    Icon = "alert"
                });
            }

            // ── Insight 4: Racha positiva ─────────────────────
            var bestStreak = habits.MaxBy(h => h.Streak);
            if (bestStreak != null && bestStreak.Streak >= 3)
            {
                insights.Add(new InsightDto
                {
                    Type = "streak",
                    Message = $"You're on a {bestStreak.Streak}-day streak with '{bestStreak.Name}'. Keep it up!",
                    Icon = "fire"
                });
            }

            return insights;
        }

        // ── SCORE HISTORY ────────────────────────────────────
        public async Task<List<ScoreHistoryDto>> GetScoreHistoryAsync(uint userId)
        {
            return await _context.LifeScores
                .Where(ls => ls.UserId == userId
                        && ls.ScoreDate >= DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-30)))
                .OrderBy(ls => ls.ScoreDate)
                .Select(ls => new ScoreHistoryDto
                {
                    Date = ls.ScoreDate,
                    Score = ls.Score,
                    HabitsPct = ls.HabitsPct,
                    TasksPct = ls.TasksPct,
                    GoalsPct = ls.GoalsPct
                })
                .ToListAsync();
        }

        // ── HABIT HEATMAP ────────────────────────────────────
        public async Task<List<HabitHeatmapDto>> GetHabitHeatmapAsync(uint userId)
        {
            var thirtyDaysAgo = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-30));

            var logs = await _context.HabitLogs
                .Where(hl => hl.Habit.UserId == userId
                        && hl.LogDate >= thirtyDaysAgo
                        && hl.Completed)
                .GroupBy(hl => hl.LogDate)
                .Select(g => new HabitHeatmapDto
                {
                    Date = g.Key,
                    CompletedCount = g.Count()
                })
                .OrderBy(h => h.Date)
                .ToListAsync();

            return logs;
        }

        // ── CALCULATE LIFE SCORE (llama al SP) ───────────────
        public async System.Threading.Tasks.Task CalculateLifeScoreAsync(uint userId)
        {
            await _context.Database.ExecuteSqlRawAsync(
                "CALL sp_calculate_life_score({0})", userId
            );
        }
    }
}



