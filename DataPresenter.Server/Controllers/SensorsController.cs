using DataPresenter.Server.Data;
using DataPresenter.Server.DTO.Models;
using DataPresenter.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace DataPresenter.Server.Controllers
{
    /// <summary>
    /// Controller for managing sensors (authenticated users only).
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SensorsController : ControllerBase
    {
        private readonly DataPresenterDbContext _context;

        public SensorsController(DataPresenterDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all sensors.
        /// Returns list of SensorDto with masked api keys and basic stats.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SensorDto>>> GetAllSensors()
        {
            var sensors = await _context.Sensors
                .Include(s => s.Series)
                .Include(s => s.Measurements)
                .Select(s => new SensorDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    ApiKey = MaskApiKey(s.ApiKey),
                    SeriesId = s.SeriesId,
                    SeriesName = s.Series.Name,
                    Description = s.Description,
                    IsActive = s.IsActive,
                    CreatedAt = s.CreatedAt,
                    LastDataReceived = s.LastDataReceived,
                    MeasurementCount = s.Measurements.Count
                })
                .ToListAsync();

            return Ok(sensors);
        }

        /// <summary>
        /// Retrieves a single sensor by ID.
        /// Returns 404 if sensor not found.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<SensorDto>> GetSensor(int id)
        {
            var sensor = await _context.Sensors
                .Include(s => s.Series)
                .Include(s => s.Measurements)
                .Where(s => s.Id == id)
                .Select(s => new SensorDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    ApiKey = MaskApiKey(s.ApiKey),
                    SeriesId = s.SeriesId,
                    SeriesName = s.Series.Name,
                    Description = s.Description,
                    IsActive = s.IsActive,
                    CreatedAt = s.CreatedAt,
                    LastDataReceived = s.LastDataReceived,
                    MeasurementCount = s.Measurements.Count
                })
                .FirstOrDefaultAsync();

            if (sensor == null)
            {
                return NotFound(new { message = "Sensor not foudn" });
            }

            return Ok(sensor);
        }

        /// <summary>
        /// Creates a new sensor with a generated API Key.
        /// Validates that the series exists first.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<SensorCreatedDto>> CreateSensor([FromBody] CreateSensorDto createDto)
        {
            var series = await _context.Series.FindAsync(createDto.SeriesId);
            if (series == null)
            {
                return BadRequest(new { message = "Series not found" });
            }

            var apiKey = GenerateApiKey();

            var sensor = new Sensor
            {
                Name = createDto.Name,
                ApiKey = apiKey,
                SeriesId = createDto.SeriesId,
                Description = createDto.Description,
                IsActive = true
            };

            _context.Sensors.Add(sensor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSensor), new { id = sensor.Id }, new SensorCreatedDto
            {
                Id = sensor.Id,
                Name = sensor.Name,
                ApiKey = apiKey,
                SeriesId = sensor.SeriesId
            });
        }

        /// <summary>
        /// Updates an existing sensor.
        /// Only basic fields are updatable via this endpoint.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSensor(int id, [FromBody] UpdateSensorDto updateDto)
        {
            var sensor = await _context.Sensors.FindAsync(id);

            if (sensor == null)
            {
                return NotFound(new { message = "Sensor not found" });
            }

            sensor.Name = updateDto.Name;
            sensor.Description = updateDto.Description;
            sensor.IsActive = updateDto.IsActive;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Regenerates the API Key for a sensor.
        /// Returns the new key once — it cannot be retrieved later.
        /// </summary>
        [HttpPost("{id}/regenerate-key")]
        public async Task<ActionResult<SensorCreatedDto>> RegenerateApiKey(int id)
        {
            var sensor = await _context.Sensors
                .Include(s => s.Series)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sensor == null)
            {
                return NotFound(new { message = "Sensor not found" });
            }

            var newApiKey = GenerateApiKey();
            sensor.ApiKey = newApiKey;

            await _context.SaveChangesAsync();

            return Ok(new SensorCreatedDto
            {
                Id = sensor.Id,
                Name = sensor.Name,
                ApiKey = newApiKey,
                SeriesId = sensor.SeriesId,
                Message = "A new API Key has been generated. Save it - it cannot be recvoerd later!"
            });
        }

        /// <summary>
        /// Deletes a sensor.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSensor(int id)
        {
            var sensor = await _context.Sensors
                .Include(s => s.Measurements)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sensor == null)
            {
                return NotFound(new { message = "Sensor not found" });
            }

            _context.Sensors.Remove(sensor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Gets statistics for a sensor (counts, min/max/avg, first/last timestamps).
        /// Returns 404 if sensor does not exist.
        /// </summary>
        [HttpGet("{id}/stats")]
        public async Task<ActionResult<object>> GetSensorStats(int id)
        {
            var sensor = await _context.Sensors
                .Include(s => s.Series)
                .Include(s => s.Measurements)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sensor == null)
            {
                return NotFound(new { message = "Sensor not found" });
            }

            var measurements = sensor.Measurements.ToList();

            var stats = new
            {
                sensor.Id,
                sensor.Name,
                sensor.SeriesId,
                SeriesName = sensor.Series.Name,
                TotalMeasurements = measurements.Count,
                FirstMeasurement = measurements.Any() ? measurements.Min(m => m.Timestamp) : (DateTime?)null,
                LastMeasurement = measurements.Any() ? measurements.Max(m => m.Timestamp) : (DateTime?)null,
                AverageValue = measurements.Any() ? measurements.Average(m => m.Value) : 0,
                MinValue = measurements.Any() ? measurements.Min(m => m.Value) : 0,
                MaxValue = measurements.Any() ? measurements.Max(m => m.Value) : 0,
                LastDataReceived = sensor.LastDataReceived,
                IsActive = sensor.IsActive
            };

            return Ok(stats);
        }

        /// <summary>
        /// Generates a secure API Key as a URL-safe string.
        /// Uses RNGCryptoServiceProvider equivalent via RandomNumberGenerator.
        /// </summary>
        private string GenerateApiKey()
        {
            var randomBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes).Replace("+", "").Replace("/", "").Replace("=", "");
        }

        /// <summary>
        /// Masks an API Key showing only first and last few characters.
        /// If key is missing or very short returns asterisks.
        /// </summary>
        private string MaskApiKey(string apiKey)
        {
            if (string.IsNullOrEmpty(apiKey) || apiKey.Length < 8)
            {
                return "****";
            }

            return $"{apiKey.Substring(0, 4)}...{apiKey.Substring(apiKey.Length - 4)}";
        }
    }
}
