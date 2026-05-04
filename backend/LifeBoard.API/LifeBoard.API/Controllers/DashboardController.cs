using LifeBoard.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LifeBoard.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        private uint GetUserId() =>
            uint.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // GET api/dashboard/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var summary = await _dashboardService.GetSummaryAsync(GetUserId());
            return Ok(summary);
        }

        // GET api/dashboard/insights
        [HttpGet("insights")]
        public async Task<IActionResult> GetInsights()
        {
            var insights = await _dashboardService.GetInsightsAsync(GetUserId());
            return Ok(insights);
        }

        // GET api/dashboard/score-history
        [HttpGet("score-history")]
        public async Task<IActionResult> GetScoreHistory()
        {
            var history = await _dashboardService.GetScoreHistoryAsync(GetUserId());
            return Ok(history);
        }

        // GET api/dashboard/habit-heatmap
        [HttpGet("habit-heatmap")]
        public async Task<IActionResult> GetHabitHeatmap()
        {
            var heatmap = await _dashboardService.GetHabitHeatmapAsync(GetUserId());
            return Ok(heatmap);
        }
    }
}