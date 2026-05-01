namespace LifeBoard.API.Models
{
    public class HabitLog
    {
        public uint Id { get; set; }
        public uint HabitId { get; set; }
        public DateOnly LogDate { get; set; }
        public bool Completed { get; set; } = true;
        public DateTime CreatedAt  { get; set; }

        //navegacion 
        public Habit Habit { get; set; } = null;

    }
}
