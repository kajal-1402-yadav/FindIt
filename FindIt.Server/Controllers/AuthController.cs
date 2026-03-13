using Microsoft.AspNetCore.Mvc;
using FindIt.Server.Data;
using FindIt.Server.Models;
using FindIt.Server.DTOs;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace FindIt.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    // Register user
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (existingUser != null)
            return BadRequest("Email already registered");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully" });
    }

    // Login user
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
            return Unauthorized("Invalid email or password");

        bool isValidPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
        if (!isValidPassword)
            return Unauthorized("Invalid email or password");

        return Ok(new
        {
            message = "Login successful",
            userId = user.Id,
            name = user.Name,
            email = user.Email
        });
    }
}