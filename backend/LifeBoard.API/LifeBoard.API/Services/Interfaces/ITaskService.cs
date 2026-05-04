using LifeBoard.API.DTOs.Tasks;

namespace LifeBoard.API.Services.Interfaces
{
    public interface ITaskService
    {
        Task<List<TaskResponseDto>> GetAllAsync(uint userId, string? status, string? priority);
        Task<TaskResponseDto?> GetByIdAsync(uint id, uint userId);
        Task<TaskResponseDto> CreateAsync(uint userId, TaskRequestDto request);
        Task<TaskResponseDto?> UpdateAsync(uint id, uint userId, TaskRequestDto request);
        Task<TaskResponseDto?> UpdateStatusAsync(uint id, uint userId, string status);
        Task<bool> DeleteAsync(uint id, uint userId);
    }
}