using System.ComponentModel.DataAnnotations;

namespace DataPresenter.Server.DTO.Series
{
    /// <summary>
    /// Data Transfer Object used to create a new data series.
    /// Contains display metadata and validation constraints for creating a series.
    /// </summary>
    public class CreateSeriesDto
    {
        /// <summary>
        /// The display name of the series.
        /// </summary>
        [Required]
        [StringLength(200, MinimumLength = 15)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Optional descriptive text for the series.
        /// Maximum length is 500 characters.
        /// </summary>
        [StringLength(500)]
        public string? Description { get; set; }

        /// <summary>
        /// The minimum allowed value for the series.
        /// </summary>
        [Required]
        public double MinValue { get; set; }

        /// <summary>
        /// The maximum allowed value for the series.
        /// Required numeric value.
        /// </summary>
        [Required]
        public double MaxValue { get; set; }

        /// <summary>
        /// The measurement unit for the series values (e.g., "°C", "m/s").
        /// Required. Maximum length is 50 characters.
        /// </summary>
        [Required]
        [StringLength(50)]
        public string Unit { get; set; } = string.Empty;

        /// <summary>
        /// The display color for the series in hex format (#RRGGBB).
        /// Default pink :>
        /// </summary>
        [StringLength(7)]
        [RegularExpression(@"^#[0-9A-Fa-f]{6}$", ErrorMessage = "Color must be in hex format (#RRGGBB)")]
        public string Color { get; set; } = "#f8b4aa";

        /// <summary>
        /// Optional icon name or identifier associated with the series.
        /// Maximum length is 50 characters.
        /// </summary>
        [StringLength(50)]
        public string? Icon { get; set; }
    }

}
