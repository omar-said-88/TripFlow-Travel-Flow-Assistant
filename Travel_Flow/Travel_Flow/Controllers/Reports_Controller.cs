using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Travel_Flow.Data;
using Travel_Flow.DTOs;

namespace Travel_Flow.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _context;
    public AnalyticsController(AppDbContext context) => _context = context;

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var total = await _context.Bookings.CountAsync();
        var canceled = await _context.Bookings.CountAsync(b => b.IsCanceled);
        var avgAdr = await _context.Bookings.AverageAsync(b => b.Adr);
        var totalGuests = await _context.Bookings.SumAsync(b => b.Adults + b.Children + b.Babies);

        var topCountry = await _context.Bookings
            .GroupBy(b => b.Country)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefaultAsync() ?? "N/A";

        var topHotel = await _context.Bookings
            .GroupBy(b => b.Hotel)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefaultAsync() ?? "N/A";

        return Ok(new DashboardSummary(
            total, canceled,
            Math.Round((double)canceled / total * 100, 2),
            Math.Round(avgAdr, 2),
            totalGuests, topCountry, topHotel
        ));
    }

    [HttpGet("by-hotel")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByHotel()
    {
        var result = await _context.Bookings
            .GroupBy(b => b.Hotel)
            .Select(g => new HotelSummary(
                g.Key,
                g.Count(),
                g.Count(b => b.IsCanceled),
                Math.Round((double)g.Count(b => b.IsCanceled) / g.Count() * 100, 2),
                Math.Round(g.Average(b => b.Adr), 2)
            )).ToListAsync();

        return Ok(result);
    }

    [HttpGet("monthly")]
    public async Task<IActionResult> GetMonthly([FromQuery] int? year)
    {
        var q = _context.Bookings.AsQueryable();
        if (year.HasValue) q = q.Where(b => b.ArrivalDateYear == year.Value);

        var result = await q
            .GroupBy(b => new { b.ArrivalDateYear, b.ArrivalDateMonth })
            .Select(g => new MonthlyStats(
                g.Key.ArrivalDateMonth,
                g.Key.ArrivalDateYear,
                g.Count(),
                g.Count(b => b.IsCanceled),
                Math.Round(g.Average(b => b.Adr), 2)
            ))
            .OrderBy(r => r.Year)
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("top-countries")]
    public async Task<IActionResult> GetTopCountries([FromQuery] int top = 10)
    {
        var result = await _context.Bookings
            .GroupBy(b => b.Country)
            .Select(g => new CountryStats(g.Key, g.Count()))
            .OrderByDescending(r => r.TotalBookings)
            .Take(top)
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("room-types")]
    public async Task<IActionResult> GetRoomTypes()
    {
        var result = await _context.Bookings
            .GroupBy(b => b.ReservedRoomType)
            .Select(g => new RoomTypeStats(g.Key, g.Count(), Math.Round(g.Average(b => b.Adr), 2)))
            .OrderByDescending(r => r.Bookings)
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("market-segments")]
    public async Task<IActionResult> GetMarketSegments()
    {
        var result = await _context.Bookings
            .GroupBy(b => b.MarketSegment)
            .Select(g => new MarketSegmentStats(g.Key, g.Count(), Math.Round(g.Average(b => b.Adr), 2)))
            .OrderByDescending(r => r.Bookings)
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("cancellation-by-deposit")]
    public async Task<IActionResult> GetCancellationByDeposit()
    {
        var result = await _context.Bookings
            .GroupBy(b => b.DepositType)
            .Select(g => new {
                DepositType = g.Key,
                Total = g.Count(),
                Canceled = g.Count(b => b.IsCanceled),
                CancellationRate = Math.Round((double)g.Count(b => b.IsCanceled) / g.Count() * 100, 2)
            })
            .ToListAsync();

        return Ok(result);
    }
}
