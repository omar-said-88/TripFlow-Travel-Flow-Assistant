using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Travel_Flow.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Hotel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsCanceled = table.Column<bool>(type: "bit", nullable: false),
                    LeadTime = table.Column<int>(type: "int", nullable: false),
                    ArrivalDateYear = table.Column<int>(type: "int", nullable: false),
                    ArrivalDateMonth = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ArrivalDateWeekNumber = table.Column<int>(type: "int", nullable: false),
                    ArrivalDateDayOfMonth = table.Column<int>(type: "int", nullable: false),
                    StaysInWeekendNights = table.Column<int>(type: "int", nullable: false),
                    StaysInWeekNights = table.Column<int>(type: "int", nullable: false),
                    Adults = table.Column<int>(type: "int", nullable: false),
                    Children = table.Column<int>(type: "int", nullable: false),
                    Babies = table.Column<int>(type: "int", nullable: false),
                    Meal = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MarketSegment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DistributionChannel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsRepeatedGuest = table.Column<bool>(type: "bit", nullable: false),
                    PreviousCancellations = table.Column<int>(type: "int", nullable: false),
                    PreviousBookingsNotCanceled = table.Column<int>(type: "int", nullable: false),
                    ReservedRoomType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AssignedRoomType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BookingChanges = table.Column<int>(type: "int", nullable: false),
                    DepositType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Agent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Company = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DaysInWaitingList = table.Column<int>(type: "int", nullable: false),
                    CustomerType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adr = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    RequiredCarParkingSpaces = table.Column<int>(type: "int", nullable: false),
                    TotalOfSpecialRequests = table.Column<int>(type: "int", nullable: false),
                    ReservationStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReservationStatusDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GuestName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GuestEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreditCardMasked = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
