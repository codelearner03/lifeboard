using LifeBoard.API.DTOs.Habits;
using LifeBoard.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace LifeBoard.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]

    public class HabitsController : ControllerBase
    {
        private readonly IHabitService _habitService;

        public HabitsController(IHabitService habitService)
        {
            _habitService = habitService;
        }
        private uint GetUserId() =>
            uint.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        //GET api/habits
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var habits = await _habitService.GetAllAsync(GetUserId());
            return Ok(habits);
        }

        //GET api/habits/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(uint id)
        {
            var habit = await _habitService.GetByIdAsync(id, GetUserId());
            if (habit == null) return NotFound(new { message = "Habit not found." });
            return Ok(habit);
        }
        //POST api/habits
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] HabitRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Name))
                return BadRequest(new { message = "Name is required. " });

            var habit = await _habitService.CreateAsync(GetUserId(), request);
            return CreatedAtAction(nameof(GetById), new { id = habit.Id }, habit);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(uint id, [FromBody] HabitRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Name))
                return BadRequest(new { message = "Name is required." });

            var habit = await _habitService.UpdateAsync(id, GetUserId(), request);
            if (habit == null) return NotFound(new { message = "Habit not found." });
            return Ok(habit);
        }

        // DELETE api/habits/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(uint id)
        {
            var deleted = await _habitService.DeleteAsync(id, GetUserId());
            if (!deleted) return NotFound(new { message = "Habit not found." });
            return NoContent();
        }

        //POST api/habits/{id}/complete
        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompletedToday(uint id)
        {
            var result = await _habitService.CompletedHabitTodayAsync(id, GetUserId());

            if (!result)
                return Conflict(new { message = "Habit already completed or not found. " });


            return Ok(new {message = "Habit completed successfully"});
        }

    }
}
