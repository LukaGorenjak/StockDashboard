using Microsoft.AspNetCore.Mvc;
using PortfolioApi.Services;

namespace PortfolioApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PricesController : ControllerBase
{
    private readonly FinnhubService _finnhub;

    public PricesController(FinnhubService finnhub)
    {
        _finnhub = finnhub;
    }

    // GET api/prices/AAPL
    [HttpGet("{ticker}")]
    public async Task<IActionResult> GetPrice(string ticker)
    {
        var quote = await _finnhub.GetQuoteAsync(ticker.ToUpper());

        if (quote is null)
            return NotFound($"Could not fetch price for {ticker}");

        return Ok(quote);
    }
}