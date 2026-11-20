namespace Travel_Flow.Models;

public class Booking
{
    public int Id { get; set; }
    public string Hotel { get; set; } = string.Empty;
    public bool IsCanceled { get; set; }
    public int LeadTime { get; set; }
    public int ArrivalDateYear { get; set; }
    public string ArrivalDateMonth { get; set; } = string.Empty;
    public int ArrivalDateWeekNumber { get; set; }
    public int ArrivalDateDayOfMonth { get; set; }
    public int StaysInWeekendNights { get; set; }
    public int StaysInWeekNights { get; set; }
    public int Adults { get; set; }
    public int Children { get; set; }
    public int Babies { get; set; }
    public string Meal { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string MarketSegment { get; set; } = string.Empty;
    public string DistributionChannel { get; set; } = string.Empty;
    public bool IsRepeatedGuest { get; set; }
    public int PreviousCancellations { get; set; }
    public int PreviousBookingsNotCanceled { get; set; }
    public string ReservedRoomType { get; set; } = string.Empty;
    public string AssignedRoomType { get; set; } = string.Empty;
    public int BookingChanges { get; set; }
    public string DepositType { get; set; } = string.Empty;
    public string? Agent { get; set; }
    public string? Company { get; set; }
    public int DaysInWaitingList { get; set; }
    public string CustomerType { get; set; } = string.Empty;
    public decimal Adr { get; set; }
    public int RequiredCarParkingSpaces { get; set; }
    public int TotalOfSpecialRequests { get; set; }
    public string ReservationStatus { get; set; } = string.Empty;
    public DateTime ReservationStatusDate { get; set; }
    public string GuestName { get; set; } = string.Empty;
    public string GuestEmail { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string CreditCardMasked { get; set; } = string.Empty;
}
