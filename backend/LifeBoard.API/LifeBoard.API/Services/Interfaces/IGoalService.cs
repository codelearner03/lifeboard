using LifeBoard.API.DTOs.Goals;

namespace LifeBoard.API.Services.Interfaces
{
    public interface IGoalService
    {
        Task<List<GoalResponseDto>> GetAllAsync(uint userId);
        Task<GoalResponseDto?> GetByIdAsync(uint id, uint userId);
        Task<GoalResponseDto> CreateAsync(uint userId, GoalRequestDto request);
        Task<GoalResponseDto?> UpdateAsync(uint id, uint userId, GoalRequestDto request);
        Task<bool> DeleteAsync(uint id, uint userId);
    }
}