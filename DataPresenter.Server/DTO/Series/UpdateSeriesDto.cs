using System.ComponentModel.DataAnnotations;

namespace DataPresenter.Server.DTO.Series
{
    /// <summary>
    /// Data transfer object used to update an existing series.
    /// Contains editable fields and validation attributes for server-side validation.
    /// </summary>
    public class UpdateSeriesDto
    {
        /// <summary>
        /// The display name of the series.
        /// Required. Length between 3 and 200 characters.
        /// </summary>
        [Required]
        [StringLength(200, MinimumLength = 3)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Optional longer description of the series.
        /// Maximum length 500 characters.
        /// </summary>
        [StringLength(500)]
        public string? Description { get; set; }

        /// <summary>
        /// The minimum numeric value expected for the series.
        /// Required.
        /// </summary>
        [Required]
        public double MinValue { get; set; }

        /// <summary>
        /// The maximum numeric value expected for the series.
        /// Required.
        /// </summary>
        [Required]
        public double MaxValue { get; set; }

        /// <summary>
        /// Measurement unit for the series values (e.g., "°C", "m/s").
        /// Required. Maximum length 50 characters.
        /// </summary>
        [Required]
        [StringLength(50)]
        public string Unit { get; set; } = string.Empty;

        /// <summary>
        /// Hex color for representing the series (format: #RRGGBB).
        /// Optional. Must match regex ^#[0-9A-Fa-f]{6}$ and maximum length 7.
        /// </summary>
        [StringLength(7)]
        [RegularExpression(@"^#[0-9A-Fa-f]{6}$", ErrorMessage = "Color must be in hex format (#RRGGBB)")]
        public string Color { get; set; } = "#f8b4aa";

        /// <summary>
        /// Optional icon identifier for the series.
        /// Maximum length 50 characters.
        /// </summary>
        [StringLength(50)]
        public string? Icon { get; set; }

        /// <summary>
        /// Whether the series is active and should be shown/used.
        /// Defaults to true.
        /// </summary>
        public bool IsActive { get; set; } = true;
    }
   
}
    