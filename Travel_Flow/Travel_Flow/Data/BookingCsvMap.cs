using CsvHelper.Configuration;
using System.Globalization;
using Travel_Flow.Models;

namespace Travel_Flow.Data;

public class BookingCsvMap : ClassMap<Booking>
{
    public BookingCsvMap()
    {
        Map(m => m.Hotel).Name("hotel");
        Map(m => m.IsCanceled).Name("is_canceled").Convert(r => r.Row.GetField("is_canceled") == "1");
        Map(m => m.LeadTime).Name("lead_time");
        Map(m => m.ArrivalDateYear).Name("arrival_date_year");
        Map(m => m.ArrivalDateMonth).Name("arrival_date_month");
        Map(m => m.ArrivalDateWeekNumber).Name("arrival_date_week_number");
        Map(m => m.ArrivalDateDayOfMonth).Name("arrival_date_day_of_month");
        Map(m => m.StaysInWeekendNights).Name("stays_in_weekend_nights");
        Map(m => m.StaysInWeekNights).Name("stays_in_week_nights");
        Map(m => m.Adults).Name("adults");
        Map(m => m.Children).Name("children").Convert(r => {
            var val = r.Row.GetField("children");
            return string.IsNullOrWhiteSpace(val) ? 0 : (int)decimal.Parse(val);
        });
        Map(m => m.Babies).Name("babies");
        Map(m => m.Meal).Name("meal");
        Map(m => m.Country).Name("country");
        Map(m => m.MarketSegment).Name("market_segment");
        Map(m => m.DistributionChannel).Name("distribution_channel");
        Map(m => m.IsRepeatedGuest).Name("is_repeated_guest").Convert(r => r.Row.GetField("is_repeated_guest") == "1");
        Map(m => m.PreviousCancellations).Name("previous_cancellations");
        Map(m => m.PreviousBookingsNotCanceled).Name("previous_bookings_not_canceled");
        Map(m => m.ReservedRoomType).Name("reserved_room_type");
        Map(m => m.AssignedRoomType).Name("assigned_room_type");
        Map(m => m.BookingChanges).Name("booking_changes");
        Map(m => m.DepositType).Name("deposit_type");
        Map(m => m.Agent).Name("agent");
        Map(m => m.Company).Name("company");
        Map(m => m.DaysInWaitingList).Name("days_in_waiting_list");
        Map(m => m.CustomerType).Name("customer_type");
        Map(m => m.Adr).Name("adr").Convert(r => {
            var val = r.Row.GetField("adr");
            return string.IsNullOrWhiteSpace(val) ? 0m : decimal.Parse(val, CultureInfo.InvariantCulture);
        });
        Map(m => m.RequiredCarParkingSpaces).Name("required_car_parking_spaces");
        Map(m => m.TotalOfSpecialRequests).Name("total_of_special_requests");
        Map(m => m.ReservationStatus).Name("reservation_status");
        Map(m => m.ReservationStatusDate).Name("reservation_status_date").Convert(r => {
            var val = r.Row.GetField("reservation_status_date");
            if (string.IsNullOrWhiteSpace(val)) return DateTime.MinValue;
            return DateTime.TryParse(val, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)
                ? date
                : DateTime.MinValue;
        });
        Map(m => m.GuestName).Name("name");
        Map(m => m.GuestEmail).Name("email");
        Map(m => m.PhoneNumber).Name("phone-number");
        Map(m => m.CreditCardMasked).Name("credit_card");
    }
}
