using System.Net.Http.Json;
using Microsoft.Extensions.Caching.Memory;
using PortfolioApi.Models;

namespace PortfolioApi.Services;

public class FinnhubService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMemoryCache _cache;
    private readonly string _apiKey;

    public FinnhubService(IHttpClientFactory httpClientFactory, IMemoryCache cache, IConfiguration config)
    {
        _httpClientFactory = httpClientFactory;
        _cache = cache;
        _apiKey = config["Finnhub:ApiKey"]!;
    }

    public async Task<Quote?> GetQuoteAsync(string ticker)
    {
        var cacheKey = $"quote_{ticker}";

        if (_cache.TryGetValue(cacheKey, out Quote? cached))
            return cached;

        try
        {
            var client = _httpClientFactory.CreateClient();
            var url = $"https://finnhub.io/api/v1/quote?symbol={ticker}&token={_apiKey}";

            var response = await client.GetAsync(url);
            if (!response.IsSuccessStatusCode) return null;

            var quote = await response.Content.ReadFromJsonAsync<Quote>();

            _cache.Set(cacheKey, quote, TimeSpan.FromSeconds(60));
            return quote;
        }
        catch
        {
            return null;
        }
    }
}