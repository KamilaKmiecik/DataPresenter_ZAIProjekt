using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataPresenter.Server.Models
{
    /// <summary>
    /// Represents a sensor that belongs to a series and produces measurements.
    /// </summary>
    public class Sensor
    {
        /// <summary>
        /// Primary key identifier for the sensor.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Human-readable name of the sensor.
        /// </summary>
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// API key used to authenticate data submissions for this sensor.
        /// </summary>
        [Required]
        [StringLength(100)]
        public string ApiKey { get; set; } = string.Empty;

        /// <summary>
        /// Foreign key referencing the series this sensor belongs to.
        /// </summary>
        [Required]
        public int SeriesId { get; set; }

        /// <summary>
        /// Navigation property to the Series entity.
        /// </summary>
        [ForeignKey(nameof(SeriesId))]
        public virtual Series Series { get; set; } = null!;

        /// <summary>
        /// Optional textual description of the sensor.
        /// </summary>
        [StringLength(500)]
        public string? Description { get; set; }

        /// <summary>
        /// Indicates whether the sensor is currently active.
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Timestamp when the sensor record was created.
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Timestamp of the last received measurement for this sensor, if any.
        /// </summary>
        public DateTime? LastDataReceived { get; set; }

        /// <summary>
        /// Collection of measurements produced by this sensor.
        /// </summary>
        public virtual ICollection<Measurement> Measurements { get; set; } = new List<Measurement>();
    }
}
