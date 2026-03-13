using Microsoft.AspNetCore.Mvc;
using FindIt.Server.Data;
using FindIt.Server.Models;
using FindIt.Server.DTOs;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Microsoft.Data.SqlClient;

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

    // Delete user account
    [HttpPost("delete-account")]
    public async Task<IActionResult> DeleteAccount([FromBody] DeleteAccountDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
            return NotFound("User not found");

        // Verify password before deletion
        bool isValidPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
        if (!isValidPassword)
            return Unauthorized("Invalid password");

        using var transaction = await _context.Database.BeginTransactionAsync();
        
        try
        {
            // Delete all claims related to user's items
            var deleteUserClaimsSql = "DELETE FROM Claims WHERE UserId = @userId";
            var userClaimsDeleted = await _context.Database.ExecuteSqlRawAsync(deleteUserClaimsSql, new SqlParameter("@userId", user.Id));
            Console.WriteLine($"Deleted {userClaimsDeleted} user claims using raw SQL");

            // Delete claims on user's items
            var deleteItemClaimsSql = "DELETE FROM Claims WHERE ItemId IN (SELECT Id FROM Items WHERE UserId = @userId)";
            var itemClaimsDeleted = await _context.Database.ExecuteSqlRawAsync(deleteItemClaimsSql, new SqlParameter("@userId", user.Id));
            Console.WriteLine($"Deleted {itemClaimsDeleted} claims on user's items using raw SQL");

            // Delete user's items
            var deleteItemsSql = "DELETE FROM Items WHERE UserId = @userId";
            var itemsDeleted = await _context.Database.ExecuteSqlRawAsync(deleteItemsSql, new SqlParameter("@userId", user.Id));
            Console.WriteLine($"Deleted {itemsDeleted} user items using raw SQL");

            // Delete the user
            var deleteUserSql = "DELETE FROM Users WHERE Id = @userId";
            var usersDeleted = await _context.Database.ExecuteSqlRawAsync(deleteUserSql, new SqlParameter("@userId", user.Id));
            Console.WriteLine($"Deleted {usersDeleted} user using raw SQL");

            if (usersDeleted == 0)
            {
                await transaction.RollbackAsync();
                return NotFound("User not found");
            }

            // Commit the transaction
            await transaction.CommitAsync();
            Console.WriteLine("Account deletion transaction committed successfully");

            return Ok(new { message = "Account deleted successfully" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Console.WriteLine($"Error deleting account: {ex.Message}");
            return StatusCode(500, new { 
                message = "Error deleting account", 
                error = ex.Message 
            });
        }
    }
}