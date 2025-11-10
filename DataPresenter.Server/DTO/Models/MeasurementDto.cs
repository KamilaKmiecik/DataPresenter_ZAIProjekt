using System.ComponentModel.DataAnnotations;
namespace DataPresenter.Server.DTO.Models
{

    /// <summary>
    /// DTO for returning a measurement with full information
    /// </summary>
    public class MeasurementDto
    {
        public int Id { get; set; }
        public double Value { get; set; }
        public DateTime Timestamp { get; set; }
        public int SeriesId { get; set; }
        public string SeriesName { get; set; } = string.Empty;
        public string? SeriesUnit { get; set; }
        public string? SeriesColor { get; set; }
        public string? Notes { get; set; }
        public string? SensorName { get; set; }
        public int? SensorId { get; set; }
        public int? UserId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// DTO for creating a new measurement by a user
    /// </summary>
    public class CreateMeasurementDto
    {
        [Required(ErrorMessage = "Value is required")]
        public double Value { get; set; }

        [Required(ErrorMessage = "Date and time are required")]
        public DateTime Timestamp { get; set; }

        [Required(ErrorMessage = "SeriesId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "SeriesId must be greater than 0")]
        public int SeriesId { get; set; }

        [StringLength(500, ErrorMessage = "Note cannot exceed 500 characters")]
        public string? Notes { get; set; }
    }

    /// <summary>
    /// DTO for updating an existing measurement
    /// </summary>
    public class UpdateMeasurementDto
    {
        [Required(ErrorMessage = "Value is required")]
        public double Value { get; set; }

        [Required(ErrorMessage = "Date and time are required")]
        public DateTime Timestamp { get; set; }

        [StringLength(500, ErrorMessage = "Note cannot exceed 500 characters")]
        public string? Notes { get; set; }
    }

    /// <summary>
    /// DTO for receiving measurements from sensors via the API
    /// </summary>
    public class SensorMeasurementDto
    {
        [Required(ErrorMessage = "Value is required")]
        public double Value { get; set; }

        /// <summary>
        /// Measurement timestamp. If null, the server time will be used.
        /// </summary>
        public DateTime? Timestamp { get; set; }

        [StringLength(500, ErrorMessage = "Note cannot exceed 500 characters")]
        public string? Notes { get; set; }
    }

    /// <summary>
    /// DTO for filtering measurements in GET requests
    /// </summary>
    public class MeasurementQueryDto
    {
        /// <summary>
        /// Start of the date range (inclusive)
        /// </summary>
        public DateTime? StartDate { get; set; }

        /// <summary>
        /// End of the date range (inclusive)
        /// </summary>
        public DateTime? EndDate { get; set; }

        /// <summary>
        /// List of series IDs to filter by (comma-separated in query string)
        /// </summary>
        public List<int>? SeriesIds { get; set; }

        /// <summary>
        /// Limit of returned records
        /// </summary>
        [Range(1, 10000, ErrorMessage = "Limit must be between 1 and 10000")]
        public int? Limit { get; set; }

        /// <summary>
        /// Sorting: "asc" or "desc" (default "asc")
        /// </summary>
        public string SortOrder { get; set; } = "asc";
    }

    /// <summary>
    /// DTO for returning series statistics
    /// </summary>
    public class MeasurementStatsDto
    {
        public int SeriesId { get; set; }
        public string SeriesName { get; set; } = string.Empty;
        public int Count { get; set; }
        public double MinValue { get; set; }
        public double MaxValue { get; set; }
        public double AvgValue { get; set; }
        public DateTime? FirstMeasurement { get; set; }
        public DateTime? LastMeasurement { get; set; }
    }
}

