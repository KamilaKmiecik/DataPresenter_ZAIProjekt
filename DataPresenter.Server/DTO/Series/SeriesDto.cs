namespace DataPresenter.Server.DTO.Series
{
    /// <summary>
    /// Data Transfer Object representing a data series and its metadata.
    /// </summary>
    public class SeriesDto
    {
        /// <summary>
        /// Unique identifier of the series.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Display name of the series.
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Optional detailed description of the series.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Minimum expected or observed value in the series.
        /// </summary>
        public double MinValue { get; set; }

        /// <summary>
        /// Maximum expected or observed value in the series.
        /// </summary>
        public double MaxValue { get; set; }

        /// <summary>
        /// Unit of measurement for the series values.
        /// </summary>
        public string Unit { get; set; } = string.Empty;

        /// <summary>
        /// Hex color used to render the series in the UI.
        /// </summary>
        public string Color { get; set; } = "#f8b4aa";

        /// <summary>
        /// Optional icon name or path associated with the series.
        /// </summary>
        public string? Icon { get; set; }

        /// <summary>
        /// Indicates whether the series is currently active.
        /// </summary>
        public bool IsActive { get; set; }

        /// <summary>
        /// Number of measurements currently recorded for this series.
        /// </summary>
        public int MeasurementCount { get; set; }
    }
}
