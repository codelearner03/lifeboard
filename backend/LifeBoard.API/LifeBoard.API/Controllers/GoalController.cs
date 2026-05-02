using LifeBoard.API.DTOs.Goals;
using LifeBoard.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LifeBoard.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GoalsController : ControllerBase
    {
        private readonly IGoalService _goalService;

        public GoalsController(IGoalService goalService)
        {
            _goalService = goalService;
        }

        // Helper para obtener el userId del token
        private uint GetUserId() =>
            uint.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // GET api/goals
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var goals = await _goalService.GetAllAsync(GetUserId());
            return Ok(goals);
        }

        // GET api/goals/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(uint id)
        {
            var goal = await _goalService.GetByIdAsync(id, GetUserId());
            if (goal == null) return NotFound(new { message = "Goal not found." });
            return Ok(goal);
        }

        // POST api/goals
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] GoalRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Title))
                return BadRequest(new { message = "Title is required." });

            var goal = await _goalService.CreateAsync(GetUserId(), request);
            return CreatedAtAction(nameof(GetById), new { id = goal.Id }, goal);
        }

        // PUT api/goals/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(uint id, [FromBody] GoalRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Title))
                return BadRequest(new { message = "Title is required." });

            var goal = await _goalService.UpdateAsync(id, GetUserId(), request);
            if (goal == null) return NotFound(new { message = "Goal not found." });
            return Ok(goal);
        }

        // DELETE api/goals/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(uint id)
        {
            var deleted = await _goalService.DeleteAsync(id, GetUserId());
            if (!deleted) return NotFound(new { message = "Goal not found." });
            return NoContent();
        }
    }
}