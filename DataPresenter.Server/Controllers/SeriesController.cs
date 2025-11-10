using DataPresenter.Server.Data;
using DataPresenter.Server.DTO.Series;
using DataPresenter.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataPresenter.Server.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class SeriesController : ControllerBase
    {
        private readonly DataPresenterDbContext _context;

        public SeriesController(DataPresenterDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Pobiera wszystkie serie pomiarowe
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SeriesDto>>> GetAllSeries()
        {
            var series = await _context.Series
                .Include(s => s.Measurements)
                .Select(s => new SeriesDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    MinValue = s.MinValue,
                    MaxValue = s.MaxValue,
                    Unit = s.Unit,
                    Color = s.Color,
                    Icon = s.Icon,
                    IsActive = s.IsActive,
                    MeasurementCount = s.Measurements.Count
                })
                .ToListAsync();

            return Ok(series);
        }

        /// <summary>
        /// Pobiera pojedynczą serię po ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<SeriesDto>> GetSeries(int id)
        {
            var series = await _context.Series
                .Include(s => s.Measurements)
                .Where(s => s.Id == id)
                .Select(s => new SeriesDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    MinValue = s.MinValue,
                    MaxValue = s.MaxValue,
                    Unit = s.Unit,
                    Color = s.Color,
                    Icon = s.Icon,
                    IsActive = s.IsActive,
                    MeasurementCount = s.Measurements.Count
                })
                .FirstOrDefaultAsync();

            if (series == null)
            {
                return NotFound(new { message = "Seria nie została znaleziona" });
            }

            return Ok(series);
        }

        /// <summary>
        /// Tworzy nową serię pomiarową (wymaga autoryzacji)
        /// </summary>
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<SeriesDto>> CreateSeries([FromBody] CreateSeriesDto createSeriesDto)
        {
            if (createSeriesDto.MinValue >= createSeriesDto.MaxValue)
            {
                return BadRequest(new { message = "MinValue musi być mniejsze od MaxValue" });
            }

            var series = new Series
            {
                Name = createSeriesDto.Name,
                Description = createSeriesDto.Description,
                MinValue = createSeriesDto.MinValue,
                MaxValue = createSeriesDto.MaxValue,
                Unit = createSeriesDto.Unit,
                Color = createSeriesDto.Color,
                Icon = createSeriesDto.Icon
            };

            _context.Series.Add(series);
            await _context.SaveChangesAsync();

            var seriesDto = new SeriesDto
            {
                Id = series.Id,
                Name = series.Name,
                Description = series.Description,
                MinValue = series.MinValue,
                MaxValue = series.MaxValue,
                Unit = series.Unit,
                Color = series.Color,
                Icon = series.Icon,
                IsActive = series.IsActive,
                MeasurementCount = 0
            };

            return CreatedAtAction(nameof(GetSeries), new { id = series.Id }, seriesDto);
        }

        /// <summary>
        /// Aktualizuje istniejącą serię (wymaga autoryzacji)
        /// </summary>
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSeries(int id, [FromBody] UpdateSeriesDto updateSeriesDto)
        {
            var series = await _context.Series.FindAsync(id);

            if (series == null)
            {
                return NotFound(new { message = "Seria nie została znaleziona" });
            }

            if (updateSeriesDto.MinValue >= updateSeriesDto.MaxValue)
            {
                return BadRequest(new { message = "MinValue musi być mniejsze od MaxValue" });
            }

            series.Name = updateSeriesDto.Name;
            series.Description = updateSeriesDto.Description;
            series.MinValue = updateSeriesDto.MinValue;
            series.MaxValue = updateSeriesDto.MaxValue;
            series.Unit = updateSeriesDto.Unit;
            series.Color = updateSeriesDto.Color;
            series.Icon = updateSeriesDto.Icon;
            series.IsActive = updateSeriesDto.IsActive;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Usuwa serię (wymaga autoryzacji)
        /// </summary>
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeries(int id)
        {
            var series = await _context.Series
                .Include(s => s.Measurements)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (series == null)
            {
                return NotFound(new { message = "Seria nie została znaleziona" });
            }

            if (series.Measurements.Any())
            {
                return BadRequest(new { message = "Nie można usunąć serii zawierającej pomiary" });
            }

            _context.Series.Remove(series);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}
