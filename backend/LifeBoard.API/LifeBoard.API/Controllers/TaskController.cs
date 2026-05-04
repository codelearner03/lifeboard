using LifeBoard.API.DTOs.Tasks;
using LifeBoard.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LifeBoard.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        private uint GetUserId() =>
            uint.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // GET api/tasks
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? status,
            [FromQuery] string? priority)
        {
            var tasks = await _taskService.GetAllAsync(GetUserId(), status, priority);
            return Ok(tasks);
        }

        // GET api/tasks/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(uint id)
        {
            var task = await _taskService.GetByIdAsync(id, GetUserId());
            if (task == null) return NotFound(new { message = "Task not found." });
            return Ok(task);
        }

        // POST api/tasks
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaskRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Title))
                return BadRequest(new { message = "Title is required." });

            var task = await _taskService.CreateAsync(GetUserId(), request);
            return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
        }

        // PUT api/tasks/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(uint id, [FromBody] TaskRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Title))
                return BadRequest(new { message = "Title is required." });

            var task = await _taskService.UpdateAsync(id, GetUserId(), request);
            if (task == null) return NotFound(new { message = "Task not found." });
            return Ok(task);
        }

        // PATCH api/tasks/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(uint id, [FromBody] TaskStatusRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Status))
                return BadRequest(new { message = "Status is required." });

            var task = await _taskService.UpdateStatusAsync(id, GetUserId(), request.Status);

            if (task == null)
                return BadRequest(new { message = "Invalid status or task not found." });

            return Ok(task);
        }

        // DELETE api/tasks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(uint id)
        {
            var deleted = await _taskService.DeleteAsync(id, GetUserId());
            if (!deleted) return NotFound(new { message = "Task not found." });
            return NoContent();
        }
    }
}