using LifeBoard.API.DTOs.Auth;

namespace LifeBoard.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request);
        Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
    }
}