using LifeBoard.API.DTOs.Dashboard;

namespace LifeBoard.API.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetSummaryAsync(uint userId);
        Task<List<InsightDto>> GetInsightsAsync(uint userId);
        Task<List<ScoreHistoryDto>> GetScoreHistoryAsync(uint userId);
        Task<List<HabitHeatmapDto>> GetHabitHeatmapAsync(uint userId);
        System.Threading.Tasks.Task CalculateLifeScoreAsync(uint userId);
    }
}