using CsvHelper;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using Travel_Flow.Models;

namespace Travel_Flow.Data;

public static class CsvSeeder
{
    public static async Task SeedAsync(AppDbContext context, string csvPath)
    {
        if (await context.Bookings.AnyAsync()) return;

        using var reader = new StreamReader(csvPath);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

        csv.Context.RegisterClassMap<BookingCsvMap>();
        var records = csv.GetRecords<Booking>().ToList();

        const int batchSize = 1000;
        for (int i = 0; i < records.Count; i += batchSize)
        {
            var batch = records.Skip(i).Take(batchSize).ToList();
            await context.Bookings.AddRangeAsync(batch);
            await context.SaveChangesAsync();
            context.ChangeTracker.Clear(); // free memory between batches
        }
    }
}
