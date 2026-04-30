namespace LifeBoard.API.Models
{
    public class User
    {
        public uint Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash {  get; set; } = string.Empty;   
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAT { get; set; }

        //navegacion 
        public ICollection<Goal> Goals { get; set; } = new List<Goal>();
        public ICollection<Habit> Habits { get; set; } = new List<Habit>();
        public ICollection<Task> Tasks { get; set; } = new List<Task>();
        public ICollection<LifeScore> LifeScores { get; set; } = new List<LifeScore>();



    }
}
