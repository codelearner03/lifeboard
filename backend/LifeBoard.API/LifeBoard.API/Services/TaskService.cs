using LifeBoard.API.Data;
using LifeBoard.API.DTOs.Tasks;
using LifeBoard.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LifeBoard.API.Services
{
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _context;

        public TaskService(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL 
        public async Task<List<TaskResponseDto>> GetAllAsync(uint userId, string? status, string? priority)
        {
            var query = _context.Tasks
                .Where(t => t.UserId == userId)
                .Include(t => t.Goal)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(t => t.Status == status);

            if (!string.IsNullOrEmpty(priority))
                query = query.Where(t => t.Priority == priority);

            var tasks = await query
                .OrderBy(t => t.Priority == "high" ? 0 : t.Priority == "medium" ? 1 : 2)
                .ThenBy(t => t.DueDate)
                .ToListAsync();

            return tasks.Select(t => ToDto(t)).ToList();
        }

        // GET BY ID 
        public async Task<TaskResponseDto?> GetByIdAsync(uint id, uint userId)
        {
            var task = await _context.Tasks
                .Include(t => t.Goal)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            return task == null ? null : ToDto(task);
        }

        //CREATE 
        public async Task<TaskResponseDto> CreateAsync(uint userId, TaskRequestDto request)
        {
            var task = new Models.Task
            {
                UserId = userId,
                GoalId = request.GoalId,
                Title = request.Title,
                Description = request.Description,
                Priority = request.Priority,
                Status = "pending",
                DueDate = request.DueDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return ToDto(task);
        }

        // UPDATE 
        public async Task<TaskResponseDto?> UpdateAsync(uint id, uint userId, TaskRequestDto request)
        {
            var task = await _context.Tasks
                .Include(t => t.Goal)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null) return null;

            task.Title = request.Title;
            task.Description = request.Description;
            task.Priority = request.Priority;
            task.DueDate = request.DueDate;
            task.GoalId = request.GoalId;
            task.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return ToDto(task);
        }

        // UPDATE STATUS 
        public async Task<TaskResponseDto?> UpdateStatusAsync(uint id, uint userId, string status)
        {
            var validStatuses = new[] { "pending", "in_progress", "completed" };
            if (!validStatuses.Contains(status))
                return null;

            var task = await _context.Tasks
                .Include(t => t.Goal)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null) return null;

            task.Status = status;
            task.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return ToDto(task);
        }

        // DELETE 
        public async Task<bool> DeleteAsync(uint id, uint userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return true;
        }

        //MAPPER 
        private static TaskResponseDto ToDto(Models.Task task)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            return new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Priority = task.Priority,
                Status = task.Status,
                DueDate = task.DueDate,
                IsOverdue = task.DueDate.HasValue
                              && task.DueDate.Value < today
                              && task.Status != "completed",
                GoalId = task.GoalId,
                GoalTitle = task.Goal?.Title,
                CreatedAt = task.CreatedAt
            };
        }
    }
}