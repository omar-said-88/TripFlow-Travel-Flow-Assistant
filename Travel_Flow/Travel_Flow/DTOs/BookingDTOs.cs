using System.ComponentModel.DataAnnotations;

namespace Travel_Flow.DTOs;

public class BookingDto
{
    public int Id { get; set; }
    public string Hotel { get; set; } = string.Empty;
    public bool IsCanceled { get; set; }
    public string GuestName { get; set; } = string.Empty;
    public string GuestEmail { get; set; } = string.Empty;
    public int ArrivalDateYear { get; set; }
    public string ArrivalDateMonth { get; set; } = string.Empty;
    public int ArrivalDateDayOfMonth { get; set; }
    public int Adults { get; set; }
    public int Children { get; set; }
    public string ReservationStatus { get; set; } = string.Empty;
    public decimal Adr { get; set; }
    public string Country { get; set; } = string.Empty;
    public string MarketSegment { get; set; } = string.Empty;
    public string ReservedRoomType { get; set; } = string.Empty;
}

public class CreateBookingDto
{
    [Required] public string Hotel { get; set; } = string.Empty;
    [Required] public string GuestName { get; set; } = string.Empty;
    [Required][EmailAddress] public string GuestEmail { get; set; } = string.Empty;
    [Required] public string PhoneNumber { get; set; } = string.Empty;
    [Range(2015, 2030)] public int ArrivalDateYear { get; set; }
    [Required] public string ArrivalDateMonth { get; set; } = string.Empty;
    [Range(1, 31)] public int ArrivalDateDayOfMonth { get; set; }
    [Range(0, 20)] public int Adults { get; set; }
    [Range(0, 10)] public int Children { get; set; }
    [Range(0, 10)] public int Babies { get; set; }
    public string Meal { get; set; } = "BB";
    [Required] public string Country { get; set; } = string.Empty;
    public string ReservedRoomType { get; set; } = "A";
    public string DepositType { get; set; } = "No Deposit";
    [Range(0, 1000)] public decimal Adr { get; set; }
}

public class UpdateBookingDto : CreateBookingDto
{
    public bool IsCanceled { get; set; }
    public string ReservationStatus { get; set; } = "Check-Out";
}

public class BookingQueryParams
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? Hotel { get; set; }
    public string? ReservationStatus { get; set; }
    public string? Country { get; set; }
    public bool? IsCanceled { get; set; }
    public int? Year { get; set; }
    public string? Search { get; set; }
    public string SortBy { get; set; } = "Id";
    public string SortOrder { get; set; } = "asc";
}

public class PagedResult<T>
{
    public List<T> Data { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
