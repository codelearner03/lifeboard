namespace LifeBoard.API.Models
{
    public class Goal
    {
        public uint Id { get; set; }
        public uint UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = "Other";
        public DateOnly? DueDate { get; set; }
        public decimal Progress { get; set; } = 0;
        public string Status { get; set; } = "active";
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        //navegacion
        public User User { get; set; } = null;
        public ICollection<Habit> Habits { get; set; } = new List<Habit>();
        public ICollection<Task> Tasks { get; set; } = new List<Task>();



    }
}
