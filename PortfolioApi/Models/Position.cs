using System.ComponentModel.DataAnnotations;

namespace PortfolioApi.Models;
public class Position
{
    [Key]
    public string? Ticker { get; set; }
    public int Amount { get; set; }
    public decimal BuyPrice { get; set; }
    public decimal CurrentPrice { get; set; }
}
