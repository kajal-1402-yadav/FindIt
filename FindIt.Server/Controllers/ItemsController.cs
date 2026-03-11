using FindIt.Server.Data;
using FindIt.Server.DTOs;
using FindIt.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            return Ok(new { message = "Backend is working!", timestamp = DateTime.UtcNow });
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
                Date = DateTime.UtcNow,
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
    }
}