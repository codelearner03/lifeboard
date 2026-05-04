    using LifeBoard.API.Models;
    using Microsoft.EntityFrameworkCore;

    namespace LifeBoard.API.Data
    {
        public class AppDbContext : DbContext
        {
            public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

            //tablas
            public DbSet<User> Users { get; set; }
            public DbSet<Goal> Goals { get; set; }
            public DbSet<Habit> Habits { get; set; }
            public DbSet<HabitLog> HabitLogs { get; set; }
            public DbSet<Models.Task> Tasks { get; set; }
            public DbSet<LifeScore> LifeScores { get; set; }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                base.OnModelCreating(modelBuilder);

                //users
                modelBuilder.Entity<User>(entity =>
                {
                    entity.ToTable("users");
                    entity.HasKey(e => e.Id);
                    entity.Property(e => e.Id).HasColumnName("id");
                    entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
                    entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(150).IsRequired();
                    entity.HasIndex(e => e.Email).IsUnique();
                    entity.Property(e => e.PasswordHash).HasColumnName("password_hash").HasMaxLength(255).IsRequired();
                    entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                    entity.Property(e => e.UpdatedAT).HasColumnName("updated_at");
                });

                //goals
                modelBuilder.Entity<Goal>(entity =>
                {
                    entity.ToTable("goals");
                    entity.HasKey(e => e.Id);
                    entity.Property(e => e.Id).HasColumnName("id");
                    entity.Property(e => e.UserId).HasColumnName("user_id");
                    entity.Property(e => e.Title).HasColumnName("title").HasMaxLength(150).IsRequired();
                    entity.Property(e => e.Description).HasColumnName("description");
                    entity.Property(e => e.Category).HasColumnName("category").HasMaxLength(20).HasDefaultValue("other");
                    entity.Property(e => e.DueDate).HasColumnName("due_date");
                    entity.Property(e => e.Progress).HasColumnName("progress").HasPrecision(5, 2);
                    entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20).HasDefaultValue("active");
                    entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                    entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

                    entity.HasOne(e => e.User)
                          .WithMany(u => u.Goals)
                          .HasForeignKey(e => e.UserId)
                          .OnDelete(DeleteBehavior.Cascade);
                });

                modelBuilder.Entity<Habit>(entity =>
                {
                    entity.ToTable("habits");
                    entity.HasKey(e => e.Id);
                    entity.Property(e => e.Id).HasColumnName("id");
                    entity.Property(e => e.UserId).HasColumnName("user_id");
                    entity.Property(e => e.GoalId).HasColumnName("goal_id");
                    entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(150).IsRequired();
                    entity.Property(e => e.Description).HasColumnName("description");
                    entity.Property(e => e.Frequency).HasColumnName("frequency").HasMaxLength(10).HasDefaultValue("daily");
                    entity.Property(e => e.Icon).HasColumnName("icon").HasMaxLength(50).HasDefaultValue("star");
                    entity.Property(e => e.Streak).HasColumnName("streak").HasDefaultValue(0u);
                    entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                    entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

                    entity.HasOne(e => e.User)
                          .WithMany(u => u.Habits)
                          .HasForeignKey(e => e.UserId)
                          .OnDelete(DeleteBehavior.Cascade);

                    entity.HasOne(e => e.Goal)
                          .WithMany(g => g.Habits)
                          .HasForeignKey(e => e.GoalId)
                          .OnDelete(DeleteBehavior.SetNull);

                });

                //habitLogs
                modelBuilder.Entity<HabitLog>(entity =>
                {
                    entity.ToTable("habit_logs");
                    entity.HasKey(e => e.Id);
                    entity.Property(e => e.Id).HasColumnName("id");
                    entity.Property(e => e.HabitId).HasColumnName("habit_id");
                    entity.Property(e => e.LogDate).HasColumnName("log_date");
                    entity.Property(e => e.Completed).HasColumnName("completed").HasDefaultValue(true);
                    entity.Property(e => e.CreatedAt).HasColumnName("created_at");

                    entity.HasIndex(e => new { e.HabitId, e.LogDate }).IsUnique();

                    entity.HasOne(e => e.Habit)
                          .WithMany(h => h.HabitLogs)
                          .HasForeignKey(e => e.HabitId)
                          .OnDelete(DeleteBehavior.Cascade);
                });


                //tasks
                modelBuilder.Entity<Models.Task>(entity =>
                {
                    entity.ToTable("tasks");
                    entity.HasKey(e => e.Id);
                    entity.Property(e => e.Id).HasColumnName("id");
                    entity.Property(e => e.UserId).HasColumnName("user_id");
                    entity.Property(e => e.GoalId).HasColumnName("goal_id");
                    entity.Property(e => e.Title).HasColumnName("title").HasMaxLength(150).IsRequired();
                    entity.Property(e => e.Description).HasColumnName("description");
                    entity.Property(e => e.Priority).HasColumnName("priority").HasMaxLength(10).HasDefaultValue("medium");
                    entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20).HasDefaultValue("pending");
                    entity.Property(e => e.DueDate).HasColumnName("due_date");
                    entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                    entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

                    entity.HasOne(e => e.User)
                          .WithMany(u => u.Tasks)
                          .HasForeignKey(e => e.UserId)
                          .OnDelete(DeleteBehavior.Cascade);

                    entity.HasOne(e => e.Goal)
                          .WithMany(g => g.Tasks)
                          .HasForeignKey(e => e.GoalId)
                          .OnDelete(DeleteBehavior.SetNull);

                });

                //lifeScores
                modelBuilder.Entity<LifeScore>(entity =>
                {
                    entity.ToTable("life_scores");
                    entity.HasKey(e => e.Id);
                    entity.Property(e => e.Id).HasColumnName("id");
                    entity.Property(e => e.UserId).HasColumnName("user_id");
                    entity.Property(e => e.Score).HasColumnName("score").HasPrecision(5, 2);
                    entity.Property(e => e.HabitsPct).HasColumnName("habits_pct").HasPrecision(5, 2);
                    entity.Property(e => e.TasksPct).HasColumnName("tasks_pct").HasPrecision(5, 2);
                    entity.Property(e => e.GoalsPct).HasColumnName("goals_pct").HasPrecision(5, 2);
                    entity.Property(e => e.ScoreDate).HasColumnName("score_date");
                    entity.Property(e => e.CreatedAt).HasColumnName("created_at");

                    entity.HasIndex(e => new { e.UserId, e.ScoreDate }).IsUnique();

                    entity.HasOne(e => e.User)
                          .WithMany(u => u.LifeScores)
                          .HasForeignKey(e => e.UserId)
                          .OnDelete(DeleteBehavior.Cascade);
                });
            }

        }
    }
