using DataPresenter.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using DbContext = Microsoft.EntityFrameworkCore.DbContext;

namespace DataPresenter.Server.Data
{
    /// <summary>
    /// EF Core database context for the DataPresenter application.
    /// Contains DbSet properties for Users, Series, Measurements and Sensors
    /// and configures relationships, indexes and seed data.
    /// </summary>
    public class DataPresenterDbContext : DbContext
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DataPresenterDbContext"/> class.
        /// </summary>
        /// <param name="options">The options to be used by a <see cref="DbContext"/>.</param>
        public DataPresenterDbContext(DbContextOptions<DataPresenterDbContext> options)
            : base(options)
        {   
        }

        /// <summary>
        /// Gets or sets the Users table.
        /// </summary>
        public DbSet<User> Users { get; set; }

        /// <summary>
        /// Gets or sets the Series table (measurement series / data types).
        /// </summary>
        public DbSet<Series> Series { get; set; }

        /// <summary>
        /// Gets or sets the Measurements table (individual measurement records).
        /// </summary>
        public DbSet<Measurement> Measurements { get; set; }

        /// <summary>
        /// Gets or sets the Sensors table (physical or logical sensors producing data).
        /// </summary>
        public DbSet<Sensor> Sensors { get; set; }

        /// <summary>
        /// Configures the model relationships, indexes and seeds initial data.
        /// </summary>
        /// <param name="modelBuilder">The <see cref="ModelBuilder"/> used to configure the model.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Measurement>()
                .HasOne(m => m.Series)
                .WithMany(s => s.Measurements)
                .HasForeignKey(m => m.SeriesId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Measurement>()
                .HasOne(m => m.User)
                .WithMany(u => u.Measurements)
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Measurement>()
                .HasOne(m => m.Sensor)
                .WithMany(s => s.Measurements)
                .HasForeignKey(m => m.SensorId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Sensor>()
                .HasOne(s => s.Series)
                .WithMany(ser => ser.Sensors)
                .HasForeignKey(s => s.SeriesId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Measurement>().HasIndex(m => m.Timestamp);
            modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();
            modelBuilder.Entity<Sensor>().HasIndex(s => s.ApiKey).IsUnique();

            SeedData(modelBuilder);
        }

        /// <summary>
        /// Adds initial seed data for users, series, sensors and measurements.
        /// the database for development/testing scenarios.
        /// </summary>
        private void SeedData(ModelBuilder modelBuilder)
        {
            var fixedDate = new DateTime(2024, 11, 1, 0, 0, 0, DateTimeKind.Utc);

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    Email = "admin@example.com",
                    PasswordHash = "$2a$11$zA2MzBfG5URvZ7.RZoP9.O3UQprC5ZBlhz6ZcY5aJrk0Gq2a4u0yW",
                    CreatedAt = fixedDate
                },
                new User
                {
                    Id = 2,
                    Username = "jan_kowalski",
                    Email = "jan.kowalski@example.com",
                    PasswordHash = "$2a$11$testhash000000000000000000000000000000000000000000000000",
                    CreatedAt = fixedDate
                },
                new User
                {
                    Id = 3,
                    Username = "anna_nowak",
                    Email = "anna.nowak@example.com",
                    PasswordHash = "$2a$11$testhash111111111111111111111111111111111111111111111111",
                    CreatedAt = fixedDate
                }
            );

            modelBuilder.Entity<Series>().HasData(
                new Series { Id = 1, Name = "Temperatura pokojowa", Description = "Pomiar temperatury w pomieszczeniach", MinValue = -10, MaxValue = 50, Unit = "°C", Color = "#EF4444", Icon = "thermometer", CreatedAt = fixedDate },
                new Series { Id = 2, Name = "Wilgotność powietrza", Description = "Pomiar wilgotności względnej", MinValue = 0, MaxValue = 100, Unit = "%", Color = "#3B82F6", Icon = "droplet", CreatedAt = fixedDate },
                new Series { Id = 3, Name = "Ciśnienie atmosferyczne", Description = "Pomiar ciśnienia powietrza", MinValue = 950, MaxValue = 1050, Unit = "hPa", Color = "#10B981", Icon = "gauge", CreatedAt = fixedDate },
                new Series { Id = 4, Name = "Natężenie światła", Description = "Pomiar jasności otoczenia", MinValue = 0, MaxValue = 10000, Unit = "lx", Color = "#FBBF24", Icon = "sun", CreatedAt = fixedDate },
                new Series { Id = 5, Name = "Stężenie CO₂", Description = "Pomiar dwutlenku węgla w powietrzu", MinValue = 300, MaxValue = 2000, Unit = "ppm", Color = "#6B7280", Icon = "cloud", CreatedAt = fixedDate }
            );

            modelBuilder.Entity<Sensor>().HasData(
                new Sensor { Id = 1, Name = "Sensor temperatury - Salon", ApiKey = "TEMP_SALON_KEY", SeriesId = 1, Description = "Czujnik DHT22 w salonie", CreatedAt = fixedDate },
                new Sensor { Id = 2, Name = "Sensor wilgotności - Salon", ApiKey = "HUM_SALON_KEY", SeriesId = 2, Description = "Czujnik DHT22 w salonie", CreatedAt = fixedDate },
                new Sensor { Id = 3, Name = "Sensor ciśnienia - Balkon", ApiKey = "PRESS_OUT_KEY", SeriesId = 3, Description = "Czujnik BMP180 na balkonie", CreatedAt = fixedDate },
                new Sensor { Id = 4, Name = "Sensor światła - Biuro", ApiKey = "LIGHT_OFFICE_KEY", SeriesId = 4, Description = "Czujnik LDR w biurze", CreatedAt = fixedDate },
                new Sensor { Id = 5, Name = "Sensor CO2 - Kuchnia", ApiKey = "CO2_KITCHEN_KEY", SeriesId = 5, Description = "Czujnik MH-Z19B w kuchni", CreatedAt = fixedDate }
            );

            modelBuilder.Entity<Measurement>().HasData(
                new Measurement { Id = 1, Value = 22.4, Timestamp = new DateTime(2024, 11, 1, 6, 0, 0, DateTimeKind.Utc), SeriesId = 1, UserId = 2, SensorId = 1, CreatedAt = fixedDate },
                new Measurement { Id = 2, Value = 23.1, Timestamp = new DateTime(2024, 11, 1, 12, 0, 0, DateTimeKind.Utc), SeriesId = 1, UserId = 2, SensorId = 1, CreatedAt = fixedDate },
                new Measurement { Id = 3, Value = 24.5, Timestamp = new DateTime(2024, 11, 2, 6, 0, 0, DateTimeKind.Utc), SeriesId = 1, UserId = 3, SensorId = 1, CreatedAt = fixedDate },

                new Measurement { Id = 4, Value = 48.3, Timestamp = new DateTime(2024, 11, 1, 6, 0, 0, DateTimeKind.Utc), SeriesId = 2, UserId = 2, SensorId = 2, CreatedAt = fixedDate },
                new Measurement { Id = 5, Value = 51.8, Timestamp = new DateTime(2024, 11, 1, 12, 0, 0, DateTimeKind.Utc), SeriesId = 2, UserId = 1, SensorId = 2, CreatedAt = fixedDate },
                new Measurement { Id = 6, Value = 55.2, Timestamp = new DateTime(2024, 11, 2, 6, 0, 0, DateTimeKind.Utc), SeriesId = 2, UserId = 3, SensorId = 2, CreatedAt = fixedDate },

                new Measurement { Id = 7, Value = 1013.2, Timestamp = new DateTime(2024, 11, 1, 6, 0, 0, DateTimeKind.Utc), SeriesId = 3, UserId = 1, SensorId = 3, CreatedAt = fixedDate },
                new Measurement { Id = 8, Value = 1011.7, Timestamp = new DateTime(2024, 11, 1, 12, 0, 0, DateTimeKind.Utc), SeriesId = 3, UserId = 2, SensorId = 3, CreatedAt = fixedDate },
                new Measurement { Id = 9, Value = 1008.5, Timestamp = new DateTime(2024, 11, 2, 6, 0, 0, DateTimeKind.Utc), SeriesId = 3, UserId = 3, SensorId = 3, CreatedAt = fixedDate },

                new Measurement { Id = 10, Value = 320.0, Timestamp = new DateTime(2024, 11, 1, 8, 0, 0, DateTimeKind.Utc), SeriesId = 4, UserId = 1, SensorId = 4, CreatedAt = fixedDate },
                new Measurement { Id = 11, Value = 750.0, Timestamp = new DateTime(2024, 11, 1, 14, 0, 0, DateTimeKind.Utc), SeriesId = 4, UserId = 1, SensorId = 4, CreatedAt = fixedDate },
                new Measurement { Id = 12, Value = 50.0, Timestamp = new DateTime(2024, 11, 1, 22, 0, 0, DateTimeKind.Utc), SeriesId = 4, UserId = 1, SensorId = 4, CreatedAt = fixedDate },

                new Measurement { Id = 13, Value = 420.0, Timestamp = new DateTime(2024, 11, 1, 6, 0, 0, DateTimeKind.Utc), SeriesId = 5, UserId = 1, SensorId = 5, CreatedAt = fixedDate },
                new Measurement { Id = 14, Value = 780.0, Timestamp = new DateTime(2024, 11, 1, 12, 0, 0, DateTimeKind.Utc), SeriesId = 5, UserId = 1, SensorId = 5, CreatedAt = fixedDate },
                new Measurement { Id = 15, Value = 610.0, Timestamp = new DateTime(2024, 11, 1, 18, 0, 0, DateTimeKind.Utc), SeriesId = 5, UserId = 3, SensorId = 5, CreatedAt = fixedDate }
            );
        }
    }
}
