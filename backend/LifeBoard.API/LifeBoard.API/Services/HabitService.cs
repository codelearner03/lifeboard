using LifeBoard.API.Data;
using LifeBoard.API.DTOs.Habits;
using LifeBoard.API.Models;
using LifeBoard.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace LifeBoard.API.Services
{
    public class HabitService : IHabitService
    {
        private readonly AppDbContext _context;

        public HabitService(AppDbContext context)
        {
            _context = context;
        }
        //GET ALL
        public async Task<List<HabitResponseDto>> GetAllAsync(uint userId)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            
            var habits = await _context.Habits
                .Where(h => h.UserId == userId)
                .Include(h => h.Goal)
                .Include(h => h.HabitLogs)
                .OrderByDescending(h => h.CreatedAt)
                .ToListAsync();

            return habits.Select(h => ToDto(h, today)).ToList();
        }

        //GET BY ID
        public async Task<HabitResponseDto?> GetByIdAsync(uint id, uint userId)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var habit = await _context.Habits
                .Include(h => h.Goal)
                .Include(h => h.HabitLogs)
                .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);

                return habit == null ? null : ToDto(habit, today);
        }
        //CREATE
        public async Task<HabitResponseDto> CreateAsync(uint userId, HabitRequestDto request)
        {
            var habit = new Habit
            {
                UserId = userId,
                GoalId = request.GoalId,
                Name = request.Name,
                Description = request.Description,
                Frequency = request.Frequency,
                Icon = request.Icon,
                Streak = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            return ToDto(habit, DateOnly.FromDateTime(DateTime.UtcNow));
        }

        //UPDATE
        public async Task<HabitResponseDto?> UpdateAsync(uint id, uint userId, HabitRequestDto request)
        {
            var habit = await _context.Habits
                .Include(h => h.Goal)
                .Include(h => h.HabitLogs)
                .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);

            if (habit == null) return null;

            habit.Name = request.Name;
            habit.Description = request.Description;
            habit.Frequency = request.Frequency;
            habit.Icon = request.Icon;
            habit.GoalId = request.GoalId;
            habit.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return ToDto(habit, DateOnly.FromDateTime(DateTime.UtcNow));
        }

        //DELETE
        public async Task<bool> DeleteAsync(uint id, uint userId)
        {
            var habit = await _context.Habits
                .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);

            if (habit == null) return false;

            _context.Habits.Remove(habit);
            await _context.SaveChangesAsync();

            return true;
        }

        //COMPLETED TODAY
        public async Task<bool> CompletedHabitTodayAsync(uint id, uint userId)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var habit = await _context.Habits
                .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);

            if (habit == null) return false;

            //verificar si ya se completo hoy
            var alreadyCompleted = await _context.HabitLogs
                .AnyAsync(hl => hl.HabitId == id && hl.LogDate == today);

            if (alreadyCompleted) return false;

            //registrar el log del dia
            var log = new HabitLog
            {
                HabitId = id,
                LogDate = today,
                Completed = true,
                CreatedAt = DateTime.UtcNow
            };
            _context.HabitLogs.Add(log);

            //actualizar racha
            var yesterday = today.AddDays(-1);
            var completedYesterday = await _context.HabitLogs
                .AnyAsync(hl => hl.HabitId == id && hl.LogDate == yesterday);

            habit.Streak = completedYesterday ? habit.Streak + 1 : 1;
            habit.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        //MAPPER
        private static HabitResponseDto ToDto(Habit habit, DateOnly today) => new HabitResponseDto
        {
            Id = habit.Id,
            Name = habit.Name,
            Description = habit.Description,
            Frequency = habit.Frequency,
            Icon = habit.Icon,
            Streak = habit.Streak,
            GoalId = habit.GoalId,
            GoalTitle = habit.Goal?.Title,
            CompletedToday = habit.HabitLogs?.Any(hl => hl.LogDate == today) ?? false,
            CreatedAt = habit.CreatedAt
        };


    }
}
