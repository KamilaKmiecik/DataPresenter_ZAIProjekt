using DataPresenter.Server.Data;
using DataPresenter.Server.DTO.Models;
using DataPresenter.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DataPresenter.Server.Controllers
{
    /// <summary>
    /// Kontroler obsługujący operacje związane z pomiarami (odczyt, tworzenie, aktualizacja, usuwanie).
    /// Zawiera również endpoint dla sensorów autoryzowanych za pomocą klucza API.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class MeasurementsController : ControllerBase
    {
        // <summary>
        // Database context instance
        // </summary>
        private readonly DataPresenterDbContext _context;

        // <summary>
        // Creates a new instnce of the measurements controller with the injected DB context.
        // </summary>
        // <param name="context">DataPresenterDbContext instance.</param>
        public MeasurementsController(DataPresenterDbContext context)
        {
            _context = context;
        }
       
        
        // Retrieves measurements with optional filtring by time range, series ids and result limit.
        // </summary>
        // <param name="startDate">Optional start date (inclusive) to filter measurements.</param>
        // <param name="endDate">Optional end date (inclusive) to filter measurements.</param>
        // <param name="seriesIds">Optional comma-separated list of series ids.</param>
        // <param name="limit">Optional limit of results (if null or <= 0 no limit).</param>
        // <returns>List of MeasurementDto matching the applied filters.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MeasurementDto>>> GetMeasurements(
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            [FromQuery] string? seriesIds,
            [FromQuery] int? limit)
        {
            var query = _context.Measurements
                .Include(m => m.Series)
                .Include(m => m.Sensor)
                .AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(m => m.Timestamp >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(m => m.Timestamp <= endDate.Value);
            }

            if (!string.IsNullOrEmpty(seriesIds))
            {
                var ids = seriesIds.Split(',').Select(int.Parse).ToList();
                query = query.Where(m => ids.Contains(m.SeriesId));
            }

            query = query.OrderBy(m => m.Timestamp);

            if (limit.HasValue && limit.Value > 0)
            {
                query = query.Take(limit.Value);
            }

            var measurements = await query
                .Select(m => new MeasurementDto
                {
                    Id = m.Id,
                    Value = m.Value,
                    Timestamp = m.Timestamp,
                    SeriesId = m.SeriesId,
                    SeriesName = m.Series.Name,
                    SeriesUnit = m.Series.Unit,
                    SeriesColor = m.Series.Color,
                    Notes = m.Notes,
                    SensorName = m.Sensor != null ? m.Sensor.Name : null
                })
                .ToListAsync();

            return Ok(measurements);
        }

        // <summary>
        // Retrieves a single measurment by its identifier.
        // </summary>
        // <param name="id">Id of the measurement to fetch.</param>
        // <returns>MeasurementDto with details or NotFound if not present.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<MeasurementDto>> GetMeasurement(int id)
        {
            var measurement = await _context.Measurements
                .Include(m => m.Series)
                .Include(m => m.Sensor)
                .Where(m => m.Id == id)
                .Select(m => new MeasurementDto
                {
                    Id = m.Id,
                    Value = m.Value,
                    Timestamp = m.Timestamp,
                    SeriesId = m.SeriesId,
                    SeriesName = m.Series.Name,
                    SeriesUnit = m.Series.Unit,
                    SeriesColor = m.Series.Color,
                    Notes = m.Notes,
                    SensorName = m.Sensor != null ? m.Sensor.Name : null
                })
                .FirstOrDefaultAsync();

            if (measurement == null)
            {
                return NotFound(new { message = "Measurment not found" });
            }

            return Ok(measurement);
        }

        // <summary>
        // Creates a new measurement submitted by an authed user.
        // Validates the value against the series range and assigns UserId from token.
        // </summary>
        // <param name="createDto">New measurement data (value, timestamp, seriesId, notes).</param>
        // <returns>Created MeasurementDto or appropriate validation/authorization error.</returns>
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<MeasurementDto>> CreateMeasurement([FromBody] CreateMeasurementDto createDto)
        {
            var series = await _context.Series.FindAsync(createDto.SeriesId);

            if (series == null)
            {
                return BadRequest(new { message = "Series not found" });
            }

            if (createDto.Value < series.MinValue || createDto.Value > series.MaxValue)
            {
                return BadRequest(new { message = $"Measurement value ({createDto.Value}) is out of range for this series ({series.MinValue} - {series.MaxValue} {series.Unit})" });
            }

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var measurement = new Measurement
            {
                Value = createDto.Value,
                Timestamp = createDto.Timestamp,
                SeriesId = createDto.SeriesId,
                UserId = userId,
                Notes = createDto.Notes
            };

            _context.Measurements.Add(measurement);
            await _context.SaveChangesAsync();

            var measurementDto = new MeasurementDto
            {
                Id = measurement.Id,
                Value = measurement.Value,
                Timestamp = measurement.Timestamp,
                SeriesId = measurement.SeriesId,
                SeriesName = series.Name,
                SeriesUnit = series.Unit,
                SeriesColor = series.Color,
                Notes = measurement.Notes
            };

            return CreatedAtAction(nameof(GetMeasurement), new { id = measurement.Id }, measurementDto);
        }

        // <summary>
        // Updates an existing measurement. Require auth.
        // Validatems value against series configuration before saving.
        // </summary>
        // <param name="id">Id of measurement to update.</param>
        // <param name="updateDto">Update payload (value, timestamp, notes).</param>
        // <returns>NoContent on success,NotFound or BadRequest on error.</returns>
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMeasurement(int id, [FromBody] UpdateMeasurementDto updateDto)
        {
            var measurement = await _context.Measurements
                .Include(m => m.Series)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (measurement == null)
            {
                return NotFound(new { message = "Measurement not found" });
            }

            if (updateDto.Value < measurement.Series.MinValue || updateDto.Value > measurement.Series.MaxValue)
            {
                return BadRequest(new { message = $"Measurement value ({updateDto.Value}) is out of range for this series ({measurement.Series.MinValue} - {measurement.Series.MaxValue} {measurement.Series.Unit})" });
            }

            measurement.Value = updateDto.Value;
            measurement.Timestamp = updateDto.Timestamp;
            measurement.Notes = updateDto.Notes;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // <summary>
        // Deletes a measurment by the given identifier. Requires authorization.
        // </summary>
        // <param name="id">Id of the measurement to delete.</param>
        // <returns>NoContent or NotFound if missing.</returns>
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMeasurement(int id)
        {
            var measurement = await _context.Measurements.FindAsync(id);

            if (measurement == null)
            {
                return NotFound(new { message = "Measurement not found" });
            }

            _context.Measurements.Remove(measurement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // <summary>
        // Endpoint for sensors,add a measurement using an API key sent in X-API-Key header.
        // Verifies sensor activity and validates the value against the sensor's series.
        // </summary>
        // <param name="apiKey">Sensor API key from X-API-Key header.</param>
        // <param name="sensorDto">Measurement data from the sensor (value, optional timestamp, notes).</param>
        // <returns>Created MeasurementDto or authorization/validation error.</returns>
        [HttpPost("sensor")]
        public async Task<ActionResult<MeasurementDto>> CreateMeasurementFromSensor(
            [FromHeader(Name = "X-API-Key")] string apiKey,
            [FromBody] SensorMeasurementDto sensorDto)
        {
            if (string.IsNullOrEmpty(apiKey))
            {
                return Unauthorized(new { message = "API Key is required" });
            }

            var sensor = await _context.Sensors
                .Include(s => s.Series)
                .FirstOrDefaultAsync(s => s.ApiKey == apiKey && s.IsActive);

            if (sensor == null)
            {
                return Unauthorized(new { message = "Invalid or inactive API Key" });
            }

            if (sensorDto.Value < sensor.Series.MinValue || sensorDto.Value > sensor.Series.MaxValue)
            {
                return BadRequest(new
                {
                    message = $"Value ({sensorDto.Value}) is out of range for this series ({sensor.Series.MinValue} - {sensor.Series.MaxValue} {sensor.Series.Unit})"
                });
            }

            var measurement = new Measurement
            {
                Value = sensorDto.Value,
                Timestamp = sensorDto.Timestamp ?? DateTime.UtcNow,
                SeriesId = sensor.SeriesId,
                SensorId = sensor.Id,
                Notes = sensorDto.Notes
            };

            _context.Measurements.Add(measurement);
            sensor.LastDataReceived = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var measurementDto = new MeasurementDto
            {
                Id = measurement.Id,
                Value = measurement.Value,
                Timestamp = measurement.Timestamp,
                SeriesId = measurement.SeriesId,
                SeriesName = sensor.Series.Name,
                SeriesUnit = sensor.Series.Unit,
                SeriesColor = sensor.Series.Color,
                Notes = measurement.Notes,
                SensorName = sensor.Name
            };

            return CreatedAtAction(nameof(GetMeasurement), new { id = measurement.Id }, measurementDto);
        }
    }
}
