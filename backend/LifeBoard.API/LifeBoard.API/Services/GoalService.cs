using LifeBoard.API.Data;
using LifeBoard.API.DTOs.Goals;
using LifeBoard.API.Models;
using LifeBoard.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LifeBoard.API.Services
{
    public class GoalService : IGoalService
    {
        private readonly AppDbContext _context;

        public GoalService(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL
        public async Task<List<GoalResponseDto>> GetAllAsync(uint userId)
        {
            var goals = await _context.Goals
                .Where(g => g.UserId == userId)
                .OrderByDescending(g => g.CreatedAt)
                .ToListAsync();

            return goals.Select(g => ToDto(g)).ToList();
        }

        // GET BY ID
        public async Task<GoalResponseDto?> GetByIdAsync(uint id, uint userId)
        {
            var goal = await _context.Goals
                .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

            return goal == null ? null : ToDto(goal);
        }

        // CREATE
        public async Task<GoalResponseDto> CreateAsync(uint userId, GoalRequestDto request)
        {
            var goal = new Goal
            {
                UserId = userId,
                Title = request.Title,
                Description = request.Description,
                Category = request.Category,
                DueDate = request.DueDate,
                Progress = 0,
                Status = "active",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Goals.Add(goal);
            await _context.SaveChangesAsync();

            return ToDto(goal);
        }

        // UPDATE
        public async Task<GoalResponseDto?> UpdateAsync(uint id, uint userId, GoalRequestDto request)
        {
            var goal = await _context.Goals
                .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

            if (goal == null) return null;

            goal.Title = request.Title;
            goal.Description = request.Description;
            goal.Category = request.Category;
            goal.DueDate = request.DueDate;
            goal.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return ToDto(goal);
        }

        // DELETE
        public async Task<bool> DeleteAsync(uint id, uint userId)
        {
            var goal = await _context.Goals
                .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

            if (goal == null) return false;

            _context.Goals.Remove(goal);
            await _context.SaveChangesAsync();

            return true;
        }

        // MAPPER
        private static GoalResponseDto ToDto(Goal goal) => new GoalResponseDto
        {
            Id = goal.Id,
            Title = goal.Title,
            Description = goal.Description,
            Category = goal.Category,
            DueDate = goal.DueDate,
            Progress = goal.Progress,
            Status = goal.Status,
            CreatedAt = goal.CreatedAt
        };
    }
}