using LifeBoard.API.DTOs.Habits;

namespace LifeBoard.API.Services.Interfaces
{
    public interface IHabitService
    {
        Task<List<HabitResponseDto>> GetAllAsync(uint userId);
        Task<HabitResponseDto> GetByIdAsync(uint id, uint userId);
        Task<HabitResponseDto> CreateAsync(uint userId, HabitRequestDto request);
        Task<HabitResponseDto?> UpdateAsync(uint id, uint userId, HabitRequestDto request);
        Task<bool> DeleteAsync(uint id, uint userId);
        Task<bool> CompletedHabitTodayAsync(uint id, uint UserId);



    }
}
