using Microsoft.EntityFrameworkCore;
using Travel_Flow.Data;
using Travel_Flow.DTOs;
using Travel_Flow.Models;
using Travel_Flow.Services;
using Xunit;

namespace Travel_Flow.Tests.Services;

public class BookingServiceTests
{
    private static AppDbContext CreateDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new AppDbContext(options);
    }

    private static Booking MakeBooking(int id, string hotel = "Resort Hotel", string country = "PRT", bool canceled = false) => new()
    {
        Id = id,
        Hotel = hotel,
        GuestName = $"Guest {id}",
        GuestEmail = $"guest{id}@example.com",
        PhoneNumber = "+351912345678",
        ArrivalDateYear = 2026,
        ArrivalDateMonth = "May",
        ArrivalDateDayOfMonth = 10,
        Adults = 2,
        Children = 0,
        Babies = 0,
        Meal = "BB",
        Country = country,
        ReservedRoomType = "A",
        AssignedRoomType = "A",
        DepositType = "No Deposit",
        Adr = 180m,
        IsCanceled = canceled,
        ReservationStatus = canceled ? "Canceled" : "Check-Out",
        ReservationStatusDate = DateTime.UtcNow,
        MarketSegment = "Online TA",
        DistributionChannel = "TA/TO",
        CustomerType = "Transient"
    };

    // ─── GetAllAsync ──────────────────────────────────────────────────────

    [Fact]
    public async Task GetAllAsync_ReturnsPagedResult_WithCorrectTotals()
    {
        await using var db = CreateDbContext(nameof(GetAllAsync_ReturnsPagedResult_WithCorrectTotals));
        db.Bookings.AddRange(MakeBooking(1), MakeBooking(2), MakeBooking(3));
        await db.SaveChangesAsync();

        var service = new BookingService(db);
        var result = await service.GetAllAsync(new BookingQueryParams { Page = 1, PageSize = 2 });

        Assert.Equal(3, result.TotalCount);
        Assert.Equal(2, result.Data.Count);
        Assert.Equal(2, result.TotalPages);
    }

    [Fact]
    public async Task GetAllAsync_FiltersBy_Hotel()
    {
        await using var db = CreateDbContext(nameof(GetAllAsync_FiltersBy_Hotel));
        db.Bookings.AddRange(MakeBooking(1, "City Hotel"), MakeBooking(2, "Resort Hotel"), MakeBooking(3, "City Hotel"));
        await db.SaveChangesAsync();

        var service = new BookingService(db);
        var result = await service.GetAllAsync(new BookingQueryParams { Hotel = "City Hotel" });

        Assert.Equal(2, result.TotalCount);
        Assert.All(result.Data, b => Assert.Equal("City Hotel", b.Hotel));
    }

    [Fact]
    public async Task GetAllAsync_FiltersBy_Country()
    {
        await using var db = CreateDbContext(nameof(GetAllAsync_FiltersBy_Country));
        db.Bookings.AddRange(MakeBooking(1, country: "PRT"), MakeBooking(2, country: "GBR"));
        await db.SaveChangesAsync();

        var service = new BookingService(db);
        var result = await service.GetAllAsync(new BookingQueryParams { Country = "PRT" });

        Assert.Equal(1, result.TotalCount);
        Assert.Equal("PRT", result.Data[0].Country);
    }

    [Fact]
    public async Task GetAllAsync_FiltersBy_IsCanceled()
    {
        await using var db = CreateDbContext(nameof(GetAllAsync_FiltersBy_IsCanceled));
        db.Bookings.AddRange(MakeBooking(1, canceled: false), MakeBooking(2, canceled: true));
        await db.SaveChangesAsync();

        var service = new BookingService(db);
        var result = await service.GetAllAsync(new BookingQueryParams { IsCanceled = true });

        Assert.Equal(1, result.TotalCount);
        Assert.True(result.Data[0].IsCanceled);
    }

    [Fact]
    public async Task GetAllAsync_SearchFilters_ByGuestNameOrEmail()
    {
        await using var db = CreateDbContext(nameof(GetAllAsync_SearchFilters_ByGuestNameOrEmail));
        db.Bookings.Add(MakeBooking(1));   // GuestName: "Guest 1", Email: "guest1@example.com"
        db.Bookings.Add(MakeBooking(2));
        await db.SaveChangesAsync();

        var service = new BookingService(db);
        var result = await service.GetAllAsync(new BookingQueryParams { Search = "guest1@" });

        Assert.Equal(1, result.TotalCount);
        Assert.Equal("Guest 1", result.Data[0].GuestName);
    }

    // ─── GetByIdAsync ─────────────────────────────────────────────────────

    [Fact]
    public async Task GetByIdAsync_ReturnsDto_WhenExists()
    {
        await using var db = CreateDbContext(nameof(GetByIdAsync_ReturnsDto_WhenExists));
        db.Bookings.Add(MakeBooking(1));
        await db.SaveChangesAsync();

        var service = new BookingService(db);
        var dto = await service.GetByIdAsync(1);

        Assert.NotNull(dto);
        Assert.Equal(1, dto!.Id);
        Assert.Equal("Guest 1", dto.GuestName);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotFound()
    {
        await using var db = CreateDbContext(nameof(GetByIdAsync_ReturnsNull_WhenNotFound));
        var service = new BookingService(db);

        var dto = await service.GetByIdAsync(999);

        Assert.Null(dto);
    }

    // ─── CreateAsync ──────────────────────────────────────────────────────

    [Fact]
    public async Task CreateAsync_PersistsBooking_AndReturnsDto()
    {
        await using var db = CreateDbContext(nameof(CreateAsync_PersistsBooking_AndReturnsDto));
        var service = new BookingService(db);

        var dto = await service.CreateAsync(new CreateBookingDto
        {
            Hotel = "City Hotel",
            GuestName = "Jane Doe",
            GuestEmail = "jane@example.com",
            PhoneNumber = "+442012345678",
            ArrivalDateYear = 2026,
            ArrivalDateMonth = "June",
            ArrivalDateDayOfMonth = 15,
            Adults = 2,
            Children = 1,
            Babies = 0,
            Meal = "HB",
            Country = "GBR",
            ReservedRoomType = "D",
            DepositType = "No Deposit",
            Adr = 220m
        });

        Assert.True(dto.Id > 0);
        Assert.Equal("City Hotel", dto.Hotel);
        Assert.Equal("Jane Doe", dto.GuestName);
        Assert.Equal(1, await db.Bookings.CountAsync());
    }

    [Fact]
    public async Task CreateAsync_SetsIsCanceled_ToFalse()
    {
        await using var db = CreateDbContext(nameof(CreateAsync_SetsIsCanceled_ToFalse));
        var service = new BookingService(db);

        var dto = await service.CreateAsync(new CreateBookingDto
        {
            Hotel = "Resort Hotel",
            GuestName = "Bob",
            GuestEmail = "bob@example.com",
            PhoneNumber = "+1234567890",
            ArrivalDateYear = 2026,
            ArrivalDateMonth = "July",
            ArrivalDateDayOfMonth = 1,
            Adults = 1,
            Country = "USA",
            Adr = 150m
        });

        Assert.False(dto.IsCanceled);
    }

    // ─── UpdateAsync ──────────────────────────────────────────────────────

    [Fact]
    public async Task UpdateAsync_UpdatesFields_AndReturnsDto()
    {
        await using var db = CreateDbContext(nameof(UpdateAsync_UpdatesFields_AndReturnsDto));
        db.Bookings.Add(MakeBooking(1));
        await db.SaveChangesAsync();

        var service = new BookingService(db);
        var updated = await service.UpdateAsync(1, new UpdateBookingDto
        {
            Hotel = "City Hotel",
            GuestName = "Updated Guest",
            GuestEmail = "updated@example.com",
            PhoneNumber = "+351900000000",
            ArrivalDateYear = 2026,
            ArrivalDateMonth = "August",
            ArrivalDateDayOfMonth = 20,
            Adults = 3,
            IsCanceled = true,
            ReservationStatus = "Canceled",
            Country = "PRT",
            Adr = 200m
        });

        Assert.NotNull(updated);
        Assert.Equal("Updated Guest", updated!.GuestName);
        Assert.True(updated.IsCanceled);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenNotFound()
    {
        await using var db = CreateDbContext(nameof(UpdateAsync_ReturnsNull_WhenNotFound));
        var service = new BookingService(db);

        var result = await service.UpdateAsync(999, new UpdateBookingDto
        {
            Hotel = "X",
            GuestName = "X",
            GuestEmail = "x@x.com",
            PhoneNumber = "+0",
            ArrivalDateYear = 2026,
            ArrivalDateMonth = "May",
            ArrivalDateDayOfMonth = 1,
            Adults = 1,
            Country = "XX",
            Adr = 0m
        });

        Assert.Null(result);
    }

    // ─── DeleteAsync ──────────────────────────────────────────────────────

    [Fact]
    public async Task DeleteAsync_RemovesBooking_ReturnsTrue()
    {
        await using var db = CreateDbContext(nameof(DeleteAsync_RemovesBooking_ReturnsTrue));
        db.Bookings.Add(MakeBooking(1));
        await db.SaveChangesAsync();

        var service = new BookingService(db);
        var result = await service.DeleteAsync(1);

        Assert.True(result);
        Assert.Equal(0, await db.Bookings.CountAsync());
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenNotFound()
    {
        await using var db = CreateDbContext(nameof(DeleteAsync_ReturnsFalse_WhenNotFound));
        var service = new BookingService(db);

        var result = await service.DeleteAsync(999);

        Assert.False(result);
    }
}
