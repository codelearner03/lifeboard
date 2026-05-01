namespace LifeBoard.API.Models
{
    public class Task
    {
        public uint Id { get; set; }
        public uint UserId { get; set; }
        public uint? GoalId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = "medium";
        public string Status { get; set; } = "pending";
        public DateOnly? DueDate { get; set; }
        public DateTime CreatedAt {  get; set; }
        public DateTime UpdatedAt { get; set; }

        //navegacion
        public User User { get; set; } = null;
        public Goal? Goal { get; set; }

    }
}
