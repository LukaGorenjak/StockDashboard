using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PositionsController : ControllerBase
{
    private readonly AppDbContext _db;

    public PositionsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var positions = await _db.Positions.ToListAsync();
        return Ok(positions);
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] Position position)
    {
        _db.Positions.Add(position);
        await _db.SaveChangesAsync();
        return Created($"/api/positions/{position.Ticker}", position);
    }

    [HttpDelete("{ticker}")]
    public async Task<IActionResult> Delete(string ticker)
    {
        var position = await _db.Positions.FirstOrDefaultAsync(p => p.Ticker == ticker);
        if (position is null) return NotFound();

        _db.Positions.Remove(position);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{ticker}/price")]
    public async Task<IActionResult> UpdatePrice(string ticker, [FromBody] UpdatePriceDto dto)
    {
        var position = await _db.Positions.FirstOrDefaultAsync(p => p.Ticker == ticker);
        if (position is null) return NotFound();

        position.CurrentPrice = dto.CurrentPrice;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record UpdatePriceDto(decimal CurrentPrice);