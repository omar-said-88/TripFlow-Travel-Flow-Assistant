namespace Travel_Flow.DTOs;

public record HotelSummary(string Hotel, int TotalBookings, int Canceled, double CancellationRate, decimal AvgAdr);
public record MonthlyStats(string Month, int Year, int TotalBookings, int Canceled, decimal AvgAdr);
public record CountryStats(string Country, int TotalBookings);
public record RoomTypeStats(string RoomType, int Bookings, decimal AvgAdr);
public record MarketSegmentStats(string Segment, int Bookings, decimal AvgAdr);
public record DashboardSummary(
    int TotalBookings,
    int TotalCanceled,
    double CancellationRate,
    decimal AvgAdr,
    int TotalGuests,
    string TopCountry,
    string MostBookedHotel
);
