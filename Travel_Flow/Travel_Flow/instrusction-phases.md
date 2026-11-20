# Hotel Booking Backend — Grad Project Specification
**Stack:** ASP.NET Core 8 Web API · Entity Framework Core · SQL Server · JWT Auth

---

## Dataset Summary

The CSV contains **~119,000 hotel booking records** with the following columns:

| Column | Type | Notes |
|---|---|---|
| hotel | string | "Resort Hotel" or "City Hotel" |
| is_canceled | int (0/1) | Cancellation flag |
| lead_time | int | Days between booking and arrival |
| arrival_date_year/month/week_number/day_of_month | int/string | Arrival date parts |
| stays_in_weekend_nights | int | Weekend night count |
| stays_in_week_nights | int | Weekday night count |
| adults / children / babies | int | Guest counts |
| meal | string | BB, HB, FB, SC |
| country | string | ISO country code |
| market_segment | string | Direct, Online TA, Corporate, etc. |
| distribution_channel | string | Direct, TA/TO, Corporate, etc. |
| is_repeated_guest | int (0/1) | Returning guest flag |
| previous_cancellations | int | Historical cancellations |
| previous_bookings_not_canceled | int | Historical completed stays |
| reserved_room_type / assigned_room_type | string | A–I room type codes |
| booking_changes | int | Number of modifications |
| deposit_type | string | No Deposit, Non Refund, Refundable |
| agent / company | string/int | Agent/company IDs |
| days_in_waiting_list | int | Time spent on waitlist |
| customer_type | string | Transient, Contract, Group, Transient-Party |
| adr | float | Average Daily Rate |
| required_car_parking_spaces | int | Parking requested |
| total_of_special_requests | int | Special requests count |
| reservation_status | string | Check-Out, Canceled, No-Show |
| reservation_status_date | date | Status change date |
| name | string | Guest name |
| email | string | Guest email |
| phone-number | string | Guest phone |
| credit_card | string | Masked card (last 4 digits only) |

---

## Architecture Overview

```
Client (Postman / Swagger)
        |
  [ASP.NET Core 8 Web API]
        |
  [Service Layer (Business Logic)]
        |
  [Repository Layer (EF Core)]
        |
  [SQL Server Database]
```

---

## Phase 1 — Project Setup & Database

### Goal
Scaffold the solution, connect to SQL Server, and seed the database from the CSV.

### Tasks

**1.1 — Create the solution**
```bash
dotnet new webapi -n HotelBookingApi
cd HotelBookingApi
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package CsvHelper
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package BCrypt.Net-Next
```

**1.2 — Create the Booking entity**

`Models/Booking.cs`:
```csharp
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
```

**1.3 — Create AppDbContext**

`Data/AppDbContext.cs`:
```csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Booking>()
            .Property(b => b.Adr)
            .HasPrecision(10, 2);
    }
}
```

**1.4 — Configure connection string**

`appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HotelBookingDb;Trusted_Connection=True;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyMin32CharsLong!!",
    "Issuer": "HotelBookingApi",
    "Audience": "HotelBookingClient",
    "ExpiryInMinutes": 60
  }
}
```

**1.5 — Register services in Program.cs**
```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

**1.6 — Run migrations**
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

**1.7 — CSV Seeder**

`Data/CsvSeeder.cs`:
```csharp
public static class CsvSeeder
{
    public static async Task SeedAsync(AppDbContext context, string csvPath)
    {
        if (await context.Bookings.AnyAsync()) return;

        using var reader = new StreamReader(csvPath);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

        csv.Context.RegisterClassMap<BookingCsvMap>();
        var records = csv.GetRecords<Booking>().ToList();

        await context.Bookings.AddRangeAsync(records);
        await context.SaveChangesAsync();
    }
}
```

Call seeder in `Program.cs` after `app.Build()`:
```csharp
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await CsvSeeder.SeedAsync(db, "Data/hotel_booking.csv");
}
```

**1.8 — CSV Map class**

`Data/BookingCsvMap.cs`:
```csharp
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
            return DateTime.Parse(val, CultureInfo.InvariantCulture);
        });
        Map(m => m.GuestName).Name("name");
        Map(m => m.GuestEmail).Name("email");
        Map(m => m.PhoneNumber).Name("phone-number");
        Map(m => m.CreditCardMasked).Name("credit_card");
    }
}
```

### Deliverable
- SQL Server database with ~119,000 seeded rows
- EF Core migrations working
- API runs without errors on `dotnet run`

---

## Phase 2 — Authentication (JWT)

### Goal
Register and login endpoints returning a JWT. All protected routes require a valid Bearer token.

### Tasks

**2.1 — User model**

`Models/User.cs`:
```csharp
public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "User"; // "Admin" or "User"
}
```

**2.2 — Auth DTOs**

`DTOs/AuthDTOs.cs`:
```csharp
public record RegisterRequest(string Username, string Password);
public record LoginRequest(string Username, string Password);
public record AuthResponse(string Token, string Username, string Role);
```

**2.3 — JWT Service**

`Services/JwtService.cs`:
```csharp
public class JwtService
{
    private readonly IConfiguration _config;
    public JwtService(IConfiguration config) => _config = config;

    public string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(double.Parse(_config["Jwt:ExpiryInMinutes"]!)),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

**2.4 — Auth Controller**

`Controllers/AuthController.cs`:
```csharp
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            return BadRequest("Username already exists.");

        var user = new User
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "User"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok("User registered successfully.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials.");

        var token = _jwtService.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Username, user.Role));
    }
}
```

**2.5 — Register JWT middleware in Program.cs**
```csharp
builder.Services.AddSingleton<JwtService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();
// ...
app.UseAuthentication();
app.UseAuthorization();
```

### Endpoints
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | None | Register new user |
| POST | /api/auth/login | None | Login and get JWT |

---

## Phase 3 — Bookings CRUD API

### Goal
Full CRUD on the Bookings table with pagination, filtering, and search.

### Tasks

**3.1 — Booking DTOs**

`DTOs/BookingDTOs.cs`:
```csharp
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
    public string? Search { get; set; } // searches GuestName or GuestEmail
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
```

**3.2 — Booking Service**

`Services/BookingService.cs`:
```csharp
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
```

**3.3 — Bookings Controller**

`Controllers/BookingsController.cs`:
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _service;
    public BookingsController(IBookingService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] BookingQueryParams query)
        => Ok(await _service.GetAllAsync(query));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBookingDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
```

**3.4 — Register service in Program.cs**
```csharp
builder.Services.AddScoped<IBookingService, BookingService>();
```

### Endpoints
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | /api/bookings | User | Get all (paged, filtered) |
| GET | /api/bookings/{id} | User | Get single booking |
| POST | /api/bookings | User | Create new booking |
| PUT | /api/bookings/{id} | User | Update booking |
| DELETE | /api/bookings/{id} | Admin | Delete booking |

---

## Phase 4 — Analytics Endpoints

### Goal
Read-only aggregate endpoints to generate business insights from the dataset. These are the "interesting" endpoints that will impress your supervisor.

### Tasks

**4.1 — Analytics DTOs**

`DTOs/AnalyticsDTOs.cs`:
```csharp
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
```

**4.2 — Analytics Controller**

`Controllers/AnalyticsController.cs`:
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _context;
    public AnalyticsController(AppDbContext context) => _context = context;

    // GET /api/analytics/dashboard
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

    // GET /api/analytics/by-hotel
    [HttpGet("by-hotel")]
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

    // GET /api/analytics/monthly?year=2016
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

    // GET /api/analytics/top-countries?top=10
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

    // GET /api/analytics/room-types
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

    // GET /api/analytics/market-segments
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

    // GET /api/analytics/cancellation-by-deposit
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
```

### Endpoints
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | /api/analytics/dashboard | User | KPI summary (total, cancel rate, avg ADR) |
| GET | /api/analytics/by-hotel | User | Stats per hotel type |
| GET | /api/analytics/monthly | User | Monthly trends (filter by year) |
| GET | /api/analytics/top-countries | User | Top N countries by booking count |
| GET | /api/analytics/room-types | User | Room type demand and ADR |
| GET | /api/analytics/market-segments | User | Channel performance |
| GET | /api/analytics/cancellation-by-deposit | User | Cancellation rate by deposit type |

---

## Phase 5 — Swagger, CORS, & Production Readiness

### Goal
Make the API self-documented, accessible from any frontend, and properly configured for submission.

### Tasks

**5.1 — Swagger with JWT support**

`Program.cs`:
```csharp
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Hotel Booking API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token in the field below."
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});
```

**5.2 — CORS policy**
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
// ...
app.UseCors("AllowAll");
```

**5.3 — Global error handling middleware**

`Middleware/ErrorHandlingMiddleware.cs`:
```csharp
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    public ErrorHandlingMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
        }
    }
}
```

Register before `app.UseAuthentication()`:
```csharp
app.UseMiddleware<ErrorHandlingMiddleware>();
```

**5.4 — Health check endpoint**
```csharp
builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>();
// ...
app.MapHealthChecks("/health");
```

**5.5 — Final Program.cs order (critical)**
```
builder.Services.Add...
app = builder.Build()
app.UseMiddleware<ErrorHandlingMiddleware>()
app.UseHttpsRedirection()
app.UseCors("AllowAll")
app.UseAuthentication()
app.UseAuthorization()
app.UseSwagger()
app.UseSwaggerUI()
app.MapControllers()
app.MapHealthChecks("/health")
// Seeder call
app.Run()
```

---

## Final Project Structure

```
HotelBookingApi/
├── Controllers/
│   ├── AuthController.cs
│   ├── BookingsController.cs
│   └── AnalyticsController.cs
├── Data/
│   ├── AppDbContext.cs
│   ├── BookingCsvMap.cs
│   ├── CsvSeeder.cs
│   └── hotel_booking.csv
├── DTOs/
│   ├── AuthDTOs.cs
│   ├── BookingDTOs.cs
│   └── AnalyticsDTOs.cs
├── Middleware/
│   └── ErrorHandlingMiddleware.cs
├── Migrations/
│   └── (EF Core auto-generated)
├── Models/
│   ├── Booking.cs
│   └── User.cs
├── Services/
│   ├── JwtService.cs
│   └── BookingService.cs
├── appsettings.json
└── Program.cs
```

---

## Copilot Prompt to Start

Paste this into Copilot chat to bootstrap:

> "I am building an ASP.NET Core 8 Web API project called HotelBookingApi. Create the full folder structure with Models, DTOs, Data, Services, Controllers, and Middleware folders. Use Entity Framework Core with SQL Server. The main entity is Booking with fields: Hotel, IsCanceled, LeadTime, ArrivalDateYear, ArrivalDateMonth, ArrivalDateDayOfMonth, StaysInWeekendNights, StaysInWeekNights, Adults, Children, Babies, Meal, Country, MarketSegment, DistributionChannel, IsRepeatedGuest, PreviousCancellations, ReservedRoomType, AssignedRoomType, BookingChanges, DepositType, Agent, Company, DaysInWaitingList, CustomerType, Adr (decimal), RequiredCarParkingSpaces, TotalOfSpecialRequests, ReservationStatus, ReservationStatusDate, GuestName, GuestEmail, PhoneNumber, CreditCardMasked. Add a User entity with Id, Username, PasswordHash, Role. Implement JWT authentication using BCrypt for password hashing. Add a BookingService with full CRUD including pagination, filtering by Hotel/Country/IsCanceled/Year, and text search by GuestName/GuestEmail. Add an AnalyticsController with endpoints: dashboard (total, cancel rate, avg ADR), by-hotel, monthly, top-countries, room-types, market-segments, cancellation-by-deposit. Add Swagger with JWT Bearer support, CORS allowing all origins, global error handling middleware, and a health check endpoint. Add a CsvSeeder using CsvHelper that reads hotel_booking.csv and seeds the Bookings table on startup if empty."