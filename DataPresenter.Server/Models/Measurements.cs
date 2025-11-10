using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataPresenter.Server.Models
{
    /// <summary>
    /// Represents a single measurement value belonging to a series.
    /// </summary>
    public class Measurement
    {
        /// <summary>
        /// Primary key
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Measured numeric value.
        /// </summary>
        [Required]
        public double Value { get; set; }

        /// <summary>
        /// Timestamp when the measurement was taken.
        /// </summary>
        [Required]
        public DateTime Timestamp { get; set; }

        /// <summary>
        /// Identifier of the series this measurement belongs to.
        /// </summary>
        [Required]
        public int SeriesId { get; set; }

        /// <summary>
        /// Navigation property to the series.
        /// </summary>
        [ForeignKey(nameof(SeriesId))]
        public virtual Series Series { get; set; } = null!;

        /// <summary>
        /// Optional: identifier of the user who added the measurement.
        /// </summary>
        public int? UserId { get; set; }

        /// <summary>
        /// Optional: navigation property to the user who added the measurement.
        /// </summary>
        [ForeignKey(nameof(UserId))]
        public virtual User? User { get; set; }

        /// <summary>
        /// Optional: identifier of the sensor that provided the measurement.
        /// </summary>
        public int? SensorId { get; set; }

        /// <summary>
        /// Optional: navigation property to the sensor that provided the measurement.
        /// </summary>
        [ForeignKey(nameof(SensorId))]
        public virtual Sensor? Sensor { get; set; }

        /// <summary>
        /// Optional notes about the measurement (max 500 chars).
        /// </summary>
        [StringLength(500)]
        public string? Notes { get; set; }

        /// <summary>
        /// Record creation timestamp.
        /// </summary>
        public DateTime CreatedAt { get; set; }
    }
}
