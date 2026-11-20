namespace Travel_Flow.DTOs;

public class ChatbotSearchRequest
{
    public string? Country { get; set; }
    public string? CheckInMonth { get; set; }
    public int? CheckInYear { get; set; }
    public int Adults { get; set; } = 1;
    public int Children { get; set; } = 0;
    public decimal? MaxBudget { get; set; }
    public string? RoomType { get; set; }
}

public class ChatbotHotelResult
{
    public string HotelName { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string RoomType { get; set; } = string.Empty;
    public decimal AverageDailyRate { get; set; }
    public int MatchCount { get; set; }
    public string BookingUrl { get; set; } = string.Empty;
}

public class ChatbotSearchResponse
{
    public List<ChatbotHotelResult> Results { get; set; } = new();
    public int TotalMatches { get; set; }
    public string SearchSummary { get; set; } = string.Empty;
}

// ── AI Chat DTOs ─────────────────────────────────────────────
public class AiChatMessage
{
    public string Role { get; set; } = "user";    // "user" | "assistant"
    public string Content { get; set; } = string.Empty;
}

public class AiChatRequest
{
    public List<AiChatMessage> Messages { get; set; } = new();
    public string? PageContext { get; set; }
}

public class AiChatResponse
{
    public string Reply { get; set; } = string.Empty;
}
