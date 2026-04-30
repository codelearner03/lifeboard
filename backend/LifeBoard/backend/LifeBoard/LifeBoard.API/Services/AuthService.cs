using LifeBoard.API.Data;
using LifeBoard.API.DTOs.Auth;
using LifeBoard.API.Helpers;
using LifeBoard.API.Models;
using LifeBoard.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace LifeBoard.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthService(AppDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;

        }

        //register
        public async Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request)
        {
            var exists = await _context.Users
                .AnyAsync(u => u.Email == request.Email);
            if (exists) return null;

            //crear usuario
            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow,
                UpdatedAT = DateTime.UtcNow
            };

            //guardar en la BD
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            //generar token
            var token = _jwtHelper.GenerateToken(user);

            //retornar respuesta
            return new AuthResponseDto
            {
                Token = token,
                Name = user.Name,
                Email = user.Email,
                UserId = user.Id,
            };    
        } 

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            //buscar el User por el Email
            var user = await _context.Users
               .FirstOrDefaultAsync(u => u.Email == request.Email);


            //verificar la contrasenña
            if (user == null) return null;

            var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!passwordValid) return null;

            //generar token 
            var token = _jwtHelper.GenerateToken(user);

            //devuelvo la respuesta
            return new AuthResponseDto
            {
                Token = token,
                Name = user.Name,
                Email = user.Email,
                UserId = user.Id
            };

        }
    }
}
