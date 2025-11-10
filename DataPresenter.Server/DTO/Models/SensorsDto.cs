using System.ComponentModel.DataAnnotations;

namespace DataPresenter.Server.DTO.Models
{

    /// <summary>
    /// DTO for returning sensor information
    /// </summary>
    public class SensorDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ApiKey { get; set; } = string.Empty;
        public int SeriesId { get; set; }
        public string SeriesName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastDataReceived { get; set; }
        public int MeasurementCount { get; set; }
    }

    /// <summary>
    /// DTO for creating a new sensor
    /// </summary>
    public class CreateSensorDto
    {
        [Required(ErrorMessage = "Sensor name is required")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Name must be between 3 and 200 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "SeriesId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "SeriesId must be greater than 0")]
        public int SeriesId { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }
    }

    /// <summary>
    /// DTO for updating a sensor
    /// </summary>
    public class UpdateSensorDto
    {
        [Required(ErrorMessage = "Sensor name is required")]
        [StringLength(200, MinimumLength = 15, ErrorMessage = "Name must be between 15 and 200 characters")]
        public string Name { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;
    }

    /// <summary>
    /// DTO returned after creating a sensor
    /// </summary>
    public class SensorCreatedDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ApiKey { get; set; } = string.Empty;
        public int SeriesId { get; set; }
        public string Message { get; set; } = "Sensor has been created. Save the API Key it cannot be retrieved later!";
    }
}

