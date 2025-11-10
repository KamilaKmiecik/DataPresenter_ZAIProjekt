using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Metrics;

namespace DataPresenter.Server.Models
{
    /// <summary>
    /// Represents a data series with its metadata, measurements and associated sensors.
    /// </summary>
    public class Series
    {
        /// <summary>
        /// Primary key identifier
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Name of the series
        /// </summary>
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Optional description of the series.
        /// </summary>
        [StringLength(500)]
        public string? Description { get; set; }

        /// <summary>
        /// Minimum allowed value for measurements in this series.
        /// </summary>
        [Required]
        public double MinValue { get; set; }

        /// <summary>
        /// Maximum allowed value for measurements in this series.
        /// </summary>
        [Required]
        public double MaxValue { get; set; }

        /// <summary>
        /// Unit of measurement for series values.
        /// </summary>
        [StringLength(50)]
        public string Unit { get; set; } = string.Empty;

        /// <summary>
        /// Display color in hex format (e.g. #RRGGBB).
        /// pink ;)
        /// </summary>
        [StringLength(7)]
        public string Color { get; set; } = "#3B82F6";

        /// <summary>
        /// Optional icon name
        /// </summary>
        [StringLength(50)]
        public string? Icon { get; set; }

        /// <summary>
        /// Timestamp when the series was created.
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Indicates whether the series is active.
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Measurements associated with this series.
        /// </summary>
        public virtual ICollection<Measurement> Measurements { get; set; } = new List<Measurement>();

        /// <summary>
        /// Sensors associated with this series.
        /// </summary>
        public virtual ICollection<Sensor> Sensors { get; set; } = new List<Sensor>();
    }
}
