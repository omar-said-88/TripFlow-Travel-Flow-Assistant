using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenAI;
using OpenAI.Chat;
using Travel_Flow.Data;
using Travel_Flow.DTOs;

namespace Travel_Flow.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatbotController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public ChatbotController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config  = config;
    }

    /// <summary>
    /// Search for available hotel options based on chatbot user input.
    /// Returns grouped hotel suggestions with average daily rate and a booking URL.
    /// </summary>
    [HttpPost("search")]
    public async Task<ActionResult<ChatbotSearchResponse>> Search([FromBody] ChatbotSearchRequest request)
    {
        var query = _context.Bookings
            .Where(b => !b.IsCanceled && b.ReservationStatus != "Canceled");

        if (!string.IsNullOrWhiteSpace(request.Country))
            query = query.Where(b => b.Country == request.Country.ToUpper());

        if (!string.IsNullOrWhiteSpace(request.CheckInMonth))
            query = query.Where(b => b.ArrivalDateMonth == request.CheckInMonth);

        if (request.CheckInYear.HasValue)
            query = query.Where(b => b.ArrivalDateYear == request.CheckInYear.Value);

        if (request.Adults > 0)
            query = query.Where(b => b.Adults >= request.Adults);

        if (request.Children > 0)
            query = query.Where(b => b.Children >= request.Children);

        if (!string.IsNullOrWhiteSpace(request.RoomType))
            query = query.Where(b => b.ReservedRoomType == request.RoomType.ToUpper());

        if (request.MaxBudget.HasValue)
            query = query.Where(b => b.Adr <= request.MaxBudget.Value);

        var grouped = await query
            .GroupBy(b => new { b.Hotel, b.Country, b.ReservedRoomType })
            .Select(g => new ChatbotHotelResult
            {
                HotelName = g.Key.Hotel,
                Country = g.Key.Country,
                RoomType = g.Key.ReservedRoomType,
                AverageDailyRate = Math.Round(g.Average(b => b.Adr), 2),
                MatchCount = g.Count(),
                BookingUrl = $"/booking/checkout?hotel={Uri.EscapeDataString(g.Key.Hotel)}" +
                             $"&country={g.Key.Country}" +
                             $"&roomType={g.Key.ReservedRoomType}" +
                             (request.CheckInMonth != null ? $"&month={request.CheckInMonth}" : "") +
                             (request.CheckInYear.HasValue ? $"&year={request.CheckInYear}" : "") +
                             $"&adults={request.Adults}&children={request.Children}"
            })
            .OrderByDescending(r => r.MatchCount)
            .Take(5)
            .ToListAsync();

        var summary = BuildSummary(request, grouped.Count);

        return Ok(new ChatbotSearchResponse
        {
            Results = grouped,
            TotalMatches = grouped.Count,
            SearchSummary = summary
        });
    }

    private static string BuildSummary(ChatbotSearchRequest req, int count)
    {
        var parts = new List<string>();

        if (!string.IsNullOrWhiteSpace(req.Country))
            parts.Add($"in {req.Country.ToUpper()}");

        if (!string.IsNullOrWhiteSpace(req.CheckInMonth))
            parts.Add($"for {req.CheckInMonth}{(req.CheckInYear.HasValue ? " " + req.CheckInYear : "")}");

        if (req.Adults > 0)
            parts.Add($"for {req.Adults} adult(s)" + (req.Children > 0 ? $" and {req.Children} child(ren)" : ""));

        if (req.MaxBudget.HasValue)
            parts.Add($"under ${req.MaxBudget}/night");

        return $"Found {count} hotel option(s) {string.Join(", ", parts)}.";
    }

    // ── Hotel catalog (mirrors hotels-data.ts) ───────────────
    private const string HotelCatalog = """
        TripFlow hotel catalog (12 destinations):
        DUBAI (UAE): Burj Al Arab Jumeirah 5★ $980/night hotel; Atlantis The Palm 5★ $520/night resort; Address Downtown 5★ $310/night; JW Marriott Marquis 5★ $270/night; Sofitel The Palm 5★ $420/night resort; Premier Inn Marina 3★ $95/night; Rove Downtown 3★ $80/night; Dubai Marina Luxury Flat 4★ $150/night apartment.
        PARIS (France): Four Seasons George V 5★ $1100/night; Hotel Plaza Athenee 5★ $850/night; Le Meurice 5★ $780/night; Hotel du Louvre 4★ $290/night; Pullman Montparnasse 4★ $210/night; Paris Bastille Apartment 4★ $170/night; Marais Studio 3★ $130/night apartment; ibis Tour Eiffel 3★ $115/night.
        LONDON (UK): The Savoy 5★ $720/night; Claridge's 5★ $680/night; Marriott Grosvenor Square 5★ $440/night; Shoreditch Boutique Hotel 4★ $220/night; Canary Wharf Aparthotel 4★ $160/night; Premier Inn London Bridge 3★ $110/night.
        NEW YORK (USA): Mandarin Oriental NY 5★ $760/night; The Plaza Hotel 5★ $890/night; Marriott Marquis Times Square 4★ $340/night; The Standard High Line 4★ $280/night; Brooklyn Heights Apartment 3★ $190/night; Pod 51 Hotel 3★ $115/night.
        ROME (Italy): Hotel Hassler Roma 5★ $620/night; Hotel de Russie 5★ $590/night; NH Collection Fori Imperiali 4★ $195/night; Trastevere Cozy Flat 3★ $110/night apartment; Generator Rome 3★ $75/night.
        BARCELONA (Spain): Mandarin Oriental Barcelona 5★ $520/night; Hotel Arts 5★ $410/night; W Barcelona 5★ $380/night resort; H10 Urquinaona Plaza 4★ $155/night; Eixample Design Apartment 3★ $90/night; ibis Styles Poblenou 3★ $80/night.
        ISTANBUL (Turkey): Ciragan Palace Kempinski 5★ $520/night; Four Seasons Sultanahmet 5★ $450/night; Radisson Blu Pera 5★ $190/night; Armada Istanbul Old City 4★ $120/night; Beyoglu Boutique Apartment 3★ $65/night.
        MALDIVES: Soneva Jani 5★ $2200/night resort; One&Only Reethi Rah 5★ $1800/night resort; COMO Cocoa Island 5★ $1400/night resort; Kandima Maldives 5★ $650/night resort.
        TOKYO (Japan): The Peninsula Tokyo 5★ $690/night; Park Hyatt Tokyo 5★ $560/night; Shinjuku Granbell Hotel 4★ $160/night; Shibuya Crossing Apartment 3★ $120/night; APA Hotel Shinjuku 3★ $85/night.
        BALI (Indonesia): Four Seasons Bali at Sayan 5★ $780/night resort (Ubud); Alaya Resort Ubud 5★ $350/night; The Seminyak Beach Resort 5★ $290/night; Canggu Villa Retreat 4★ $180/night; Kuta Beach Hotel 3★ $45/night.
        SINGAPORE: Raffles Singapore 5★ $720/night; Marina Bay Sands 5★ $490/night; Hotel Jen Orchardgateway 4★ $195/night; Chinatown Heritage Apartment 3★ $130/night.
        AMSTERDAM (Netherlands): Conservatorium Hotel 5★ $480/night; Canal House Apartment 4★ $210/night; Hotel V Nesplein 4★ $195/night; ibis Amsterdam Centre 3★ $110/night.
        """;

    // ── AI free-form chat ────────────────────────────────────
    [HttpPost("message")]
    public async Task<ActionResult<AiChatResponse>> AiMessage([FromBody] AiChatRequest request)
    {
        var apiKey = _config["Groq:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
            return StatusCode(503, new { error = "Groq API key is not configured. Add your key to appsettings.json under Groq:ApiKey." });

        if (request.Messages == null || request.Messages.Count == 0)
            return BadRequest(new { error = "Messages array must not be empty." });

        // Build live DB stats
        var dbStats = await _context.Bookings
            .Where(b => !b.IsCanceled && b.ReservationStatus != "Canceled")
            .GroupBy(b => b.Country)
            .Select(g => new
            {
                Country = g.Key,
                AvgRate = Math.Round(g.Average(b => b.Adr), 0),
                Count   = g.Count()
            })
            .OrderByDescending(g => g.Count)
            .Take(8)
            .ToListAsync();

        var dbSummary = dbStats.Count > 0
            ? "Live booking statistics by country: " +
              string.Join("; ", dbStats.Select(s => $"{s.Country} avg ${s.AvgRate}/night ({s.Count:N0} bookings)"))
            : string.Empty;

        var pageSection = string.IsNullOrWhiteSpace(request.PageContext)
            ? string.Empty
            : $"\nCurrent page context: {request.PageContext}";

        var systemPrompt =
            $"""
            You are TripFlow's friendly AI travel assistant.

            {HotelCatalog}

            {dbSummary}
            {pageSection}

            When users ask about hotels, recommend only from the catalog above with accurate prices and details.
            Help users plan trips, compare hotels, suggest destinations, give packing tips, and answer visa questions.
            Keep responses concise, friendly, and helpful.
            Always respond in the same language the user uses.
            """;

        var chatMessages = new List<ChatMessage>
        {
            ChatMessage.CreateSystemMessage(systemPrompt)
        };

        foreach (var msg in request.Messages)
        {
            chatMessages.Add(msg.Role == "assistant"
                ? ChatMessage.CreateAssistantMessage(msg.Content)
                : ChatMessage.CreateUserMessage(msg.Content));
        }

        try
        {
            var clientOptions = new OpenAIClientOptions
            {
                Endpoint = new Uri("https://api.groq.com/openai/v1")
            };
            var openAiClient = new OpenAIClient(new System.ClientModel.ApiKeyCredential(apiKey), clientOptions);
            var chatClient = openAiClient.GetChatClient("llama-3.3-70b-versatile");
            var completion = await chatClient.CompleteChatAsync(chatMessages);
            var reply = completion.Value.Content[0].Text;
            return Ok(new AiChatResponse { Reply = reply });
        }
        catch (Exception ex)
        {
            return StatusCode(502, new { error = $"AI request failed: {ex.Message}" });
        }
    }
}
