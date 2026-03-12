using FindIt.Server.Data;
using FindIt.Server.DTOs;
using FindIt.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace FindIt.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ItemsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/items/test
        // Test endpoint
        [HttpGet("test")]
        public IActionResult Test()
        {
            Console.WriteLine("=== Test endpoint called ===");
            return Ok(new { message = "Backend is working!", timestamp = DateTime.UtcNow.AddHours(5.5) });
        }

        // GET: api/items/{id}
        // Get single item
        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            var item = await _context.Items
                .Include(i => i.User)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (item == null)
            {
                return NotFound();
            }

            return Ok(item);
        }

        // GET: api/items
        // Get all items
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems()
        {
            var items = await _context.Items
                .Include(i => i.User)
                .OrderByDescending(i => i.Date)
                .ToListAsync();

            return Ok(items);
        }

        // GET: api/items/user/{userId}
        // Get items created by a specific user
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Item>>> GetItemsByUser(int userId)
        {
            var items = await _context.Items
                .Where(i => i.UserId == userId)
                .OrderByDescending(i => i.Date)
                .ToListAsync();

            return Ok(items);
        }

        // POST: api/items
        // Create lost or found item
        [HttpPost]
        public async Task<IActionResult> CreateItem([FromBody] ItemCreateDto dto)
        {
            Console.WriteLine("=== CreateItem called ===");
            Console.WriteLine($"Title: {dto.Title}");
            Console.WriteLine($"Description: {dto.Description}");
            Console.WriteLine($"Location: {dto.Location}");
            Console.WriteLine($"Type: {dto.Type}");
            Console.WriteLine($"UserId: {dto.UserId}");

            var item = new Item
            {
                Title = dto.Title,
                Description = dto.Description,
                Location = dto.Location,
                Type = dto.Type,
                UserId = dto.UserId,
                Date = DateTime.UtcNow.AddHours(5.5),
                Status = "Open",
                ImageUrl = null
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            var response = new ItemResponseDto
            {
                Id = item.Id,
                Title = item.Title,
                Description = item.Description,
                Location = item.Location,
                Date = item.Date,
                Type = item.Type,
                Status = item.Status,
                ImageUrl = item.ImageUrl,
                UserId = item.UserId
            };

            return Ok(response);
        }

        // POST: api/items/{id}/update
        // Update an existing item
        [HttpPost("{id}/update")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] ItemCreateDto dto)
        {
            Console.WriteLine("=== UpdateItem called ===");
            Console.WriteLine($"Item ID: {id}");
            Console.WriteLine($"Title: {dto.Title}");
            Console.WriteLine($"Description: {dto.Description}");
            Console.WriteLine($"Location: {dto.Location}");
            Console.WriteLine($"Type: {dto.Type}");

            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound(new { message = "Item not found" });
            }

            // Update item properties
            item.Title = dto.Title;
            item.Description = dto.Description;
            item.Location = dto.Location;
            item.Type = dto.Type;

            try
            {
                await _context.SaveChangesAsync();

                var response = new ItemResponseDto
                {
                    Id = item.Id,
                    Title = item.Title,
                    Description = item.Description,
                    Location = item.Location,
                    Date = item.Date,
                    Type = item.Type,
                    Status = item.Status,
                    ImageUrl = item.ImageUrl,
                    UserId = item.UserId
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating item: {ex.Message}");
                return StatusCode(500, new { message = "Error updating item" });
            }
        }

        // POST: api/items/{id}/delete
        // Delete an existing item
        [HttpPost("{id}/delete")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            Console.WriteLine("=== DeleteItem called ===");
            Console.WriteLine($"Item ID: {id}");

            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                // Step 1: Delete all claims related to this item using raw SQL
                var deleteClaimsSql = "DELETE FROM Claims WHERE ItemId = @itemId";
                var claimsDeleted = await _context.Database.ExecuteSqlRawAsync(deleteClaimsSql, new SqlParameter("@itemId", id));
                Console.WriteLine($"Deleted {claimsDeleted} claims using raw SQL");

                // Step 2: Delete the item using raw SQL
                var deleteItemSql = "DELETE FROM Items WHERE Id = @itemId";
                var itemsDeleted = await _context.Database.ExecuteSqlRawAsync(deleteItemSql, new SqlParameter("@itemId", id));
                Console.WriteLine($"Deleted {itemsDeleted} items using raw SQL");

                if (itemsDeleted == 0)
                {
                    await transaction.RollbackAsync();
                    return NotFound(new { message = "Item not found" });
                }

                // Commit the transaction
                await transaction.CommitAsync();
                Console.WriteLine("Transaction committed successfully");

                return Ok(new { message = "Item deleted successfully" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error deleting item: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                
                // Check for specific database errors
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                
                return StatusCode(500, new { 
                    message = "Error deleting item", 
                    error = ex.Message 
                });
            }
        }
    }
}