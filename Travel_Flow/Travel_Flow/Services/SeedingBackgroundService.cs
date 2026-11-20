using Travel_Flow.Data;

namespace Travel_Flow.Services;

public class SeedingBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<SeedingBackgroundService> _logger;

    public SeedingBackgroundService(IServiceScopeFactory scopeFactory, ILogger<SeedingBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Background seeding started...");
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var csvPath = Path.Combine(AppContext.BaseDirectory, "Data", "hotel_booking.csv");
            if (File.Exists(csvPath))
            {
                await CsvSeeder.SeedAsync(db, csvPath);
                _logger.LogInformation("Background seeding completed.");
            }
            else
            {
                _logger.LogWarning("CSV file not found at: {Path}", csvPath);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during background seeding.");
        }
    }
}
