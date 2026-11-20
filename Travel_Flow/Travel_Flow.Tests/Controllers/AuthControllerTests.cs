using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Travel_Flow.Controllers;
using Travel_Flow.Data;
using Travel_Flow.DTOs;
using Travel_Flow.Models;
using Travel_Flow.Services;
using Xunit;

namespace Travel_Flow.Tests.Controllers;

public class AuthControllerTests
{
    private static AppDbContext CreateDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new AppDbContext(options);
    }

    private static JwtService CreateJwtService()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"]              = "super-secret-key-that-is-long-enough-32chars!",
                ["Jwt:Issuer"]           = "TravelFlow",
                ["Jwt:Audience"]         = "TravelFlowUsers",
                ["Jwt:ExpiryInMinutes"]  = "60"
            })
            .Build();
        return new JwtService(config);
    }

    // ─── Register ─────────────────────────────────────────────────────────

    [Fact]
    public async Task Register_ReturnsOk_ForNewUser()
    {
        await using var db = CreateDbContext(nameof(Register_ReturnsOk_ForNewUser));
        var controller = new AuthController(db, CreateJwtService());

        var result = await controller.Register(new RegisterRequest("alice", "Password1!"));

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Contains("registered", ok.Value!.ToString(), StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenUsernameExists()
    {
        await using var db = CreateDbContext(nameof(Register_ReturnsBadRequest_WhenUsernameExists));
        db.Users.Add(new User { Username = "alice", PasswordHash = "hash", Role = "User" });
        await db.SaveChangesAsync();

        var controller = new AuthController(db, CreateJwtService());
        var result = await controller.Register(new RegisterRequest("alice", "Password1!"));

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Register_HashesPassword()
    {
        await using var db = CreateDbContext(nameof(Register_HashesPassword));
        var controller = new AuthController(db, CreateJwtService());

        await controller.Register(new RegisterRequest("bob", "Password1!"));

        var user = await db.Users.FirstAsync(u => u.Username == "bob");
        Assert.NotEqual("Password1!", user.PasswordHash);
        Assert.True(BCrypt.Net.BCrypt.Verify("Password1!", user.PasswordHash));
    }

    // ─── Login ────────────────────────────────────────────────────────────

    [Fact]
    public async Task Login_ReturnsOk_WithToken_ForValidCredentials()
    {
        await using var db = CreateDbContext(nameof(Login_ReturnsOk_WithToken_ForValidCredentials));
        var jwtService = CreateJwtService();
        db.Users.Add(new User
        {
            Username = "charlie",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("mypassword"),
            Role = "User"
        });
        await db.SaveChangesAsync();

        var controller = new AuthController(db, jwtService);
        var result = await controller.Login(new LoginRequest("charlie", "mypassword"));

        var ok = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<AuthResponse>(ok.Value);
        Assert.Equal("charlie", response.Username);
        Assert.Equal("User", response.Role);
        Assert.False(string.IsNullOrEmpty(response.Token));
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_ForWrongPassword()
    {
        await using var db = CreateDbContext(nameof(Login_ReturnsUnauthorized_ForWrongPassword));
        db.Users.Add(new User
        {
            Username = "dave",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("correctpass"),
            Role = "User"
        });
        await db.SaveChangesAsync();

        var controller = new AuthController(db, CreateJwtService());
        var result = await controller.Login(new LoginRequest("dave", "wrongpass"));

        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_ForUnknownUser()
    {
        await using var db = CreateDbContext(nameof(Login_ReturnsUnauthorized_ForUnknownUser));
        var controller = new AuthController(db, CreateJwtService());

        var result = await controller.Login(new LoginRequest("nobody", "pass"));

        Assert.IsType<UnauthorizedObjectResult>(result);
    }
}
