using Microsoft.EntityFrameworkCore;
using Travel_Flow.Data;
using Travel_Flow.DTOs;
using Travel_Flow.Models;

namespace Travel_Flow.Services;

public interface IBookingService
{
    Task<PagedResult<BookingDto>> GetAllAsync(BookingQueryParams query);
    Task<BookingDto?> GetByIdAsync(int id);
    Task<BookingDto> CreateAsync(CreateBookingDto dto);
    Task<BookingDto?> UpdateAsync(int id, UpdateBookingDto dto);
    Task<bool> DeleteAsync(int id);
}

public class BookingService : IBookingService
{
    private readonly AppDbContext _context;
    public BookingService(AppDbContext context) => _context = context;

    public async Task<PagedResult<BookingDto>> GetAllAsync(BookingQueryParams query)
    {
        var q = _context.Bookings.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Hotel))
            q = q.Where(b => b.Hotel == query.Hotel);

        if (!string.IsNullOrWhiteSpace(query.ReservationStatus))
            q = q.Where(b => b.ReservationStatus == query.ReservationStatus);

        if (!string.IsNullOrWhiteSpace(query.Country))
            q = q.Where(b => b.Country == query.Country);

        if (query.IsCanceled.HasValue)
            q = q.Where(b => b.IsCanceled == query.IsCanceled.Value);

        if (query.Year.HasValue)
            q = q.Where(b => b.ArrivalDateYear == query.Year.Value);

        if (!string.IsNullOrWhiteSpace(query.Search))
            q = q.Where(b => b.GuestName.Contains(query.Search) || b.GuestEmail.Contains(query.Search));

        q = (query.SortBy.ToLower(), query.SortOrder.ToLower()) switch
        {
            ("adr", "desc") => q.OrderByDescending(b => b.Adr),
            ("adr", _) => q.OrderBy(b => b.Adr),
            ("name", "desc") => q.OrderByDescending(b => b.GuestName),
            ("name", _) => q.OrderBy(b => b.GuestName),
            (_, "desc") => q.OrderByDescending(b => b.Id),
            _ => q.OrderBy(b => b.Id)
        };

        var total = await q.CountAsync();
        var items = await q
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(b => MapToDto(b))
            .ToListAsync();

        return new PagedResult<BookingDto>
        {
            Data = items,
            TotalCount = total,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }

    public async Task<BookingDto?> GetByIdAsync(int id)
    {
        var b = await _context.Bookings.FindAsync(id);
        return b == null ? null : MapToDto(b);
    }

    public async Task<BookingDto> CreateAsync(CreateBookingDto dto)
    {
        var booking = new Booking
        {
            Hotel = dto.Hotel,
            GuestName = dto.GuestName,
            GuestEmail = dto.GuestEmail,
            PhoneNumber = dto.PhoneNumber,
            ArrivalDateYear = dto.ArrivalDateYear,
            ArrivalDateMonth = dto.ArrivalDateMonth,
            ArrivalDateDayOfMonth = dto.ArrivalDateDayOfMonth,
            Adults = dto.Adults,
            Children = dto.Children,
            Babies = dto.Babies,
            Meal = dto.Meal,
            Country = dto.Country,
            ReservedRoomType = dto.ReservedRoomType,
            AssignedRoomType = dto.ReservedRoomType,
            DepositType = dto.DepositType,
            Adr = dto.Adr,
            ReservationStatus = "Check-Out",
            ReservationStatusDate = DateTime.UtcNow,
            IsCanceled = false
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();
        return MapToDto(booking);
    }

    public async Task<BookingDto?> UpdateAsync(int id, UpdateBookingDto dto)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking == null) return null;

        booking.Hotel = dto.Hotel;
        booking.GuestName = dto.GuestName;
        booking.GuestEmail = dto.GuestEmail;
        booking.PhoneNumber = dto.PhoneNumber;
        booking.ArrivalDateYear = dto.ArrivalDateYear;
        booking.ArrivalDateMonth = dto.ArrivalDateMonth;
        booking.ArrivalDateDayOfMonth = dto.ArrivalDateDayOfMonth;
        booking.Adults = dto.Adults;
        booking.Children = dto.Children;
        booking.Babies = dto.Babies;
        booking.Meal = dto.Meal;
        booking.Country = dto.Country;
        booking.ReservedRoomType = dto.ReservedRoomType;
        booking.DepositType = dto.DepositType;
        booking.Adr = dto.Adr;
        booking.IsCanceled = dto.IsCanceled;
        booking.ReservationStatus = dto.ReservationStatus;

        await _context.SaveChangesAsync();
        return MapToDto(booking);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking == null) return false;
        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();
        return true;
    }

    private static BookingDto MapToDto(Booking b) => new()
    {
        Id = b.Id,
        Hotel = b.Hotel,
        IsCanceled = b.IsCanceled,
        GuestName = b.GuestName,
        GuestEmail = b.GuestEmail,
        ArrivalDateYear = b.ArrivalDateYear,
        ArrivalDateMonth = b.ArrivalDateMonth,
        ArrivalDateDayOfMonth = b.ArrivalDateDayOfMonth,
        Adults = b.Adults,
        Children = b.Children,
        ReservationStatus = b.ReservationStatus,
        Adr = b.Adr,
        Country = b.Country,
        MarketSegment = b.MarketSegment,
        ReservedRoomType = b.ReservedRoomType
    };
}
