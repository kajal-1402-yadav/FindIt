using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FindIt.Server.Data;
using FindIt.Server.Models;

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

        // POST: api/items
        // Create lost or found item
        [HttpPost]
        public async Task<ActionResult<Item>> CreateItem(Item item)
        {
            item.Date = DateTime.UtcNow;
            item.Status = "Open";

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

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

        // PUT: api/items/{id}
        // Update item
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, Item updatedItem)
        {
            var item = await _context.Items.FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            item.Title = updatedItem.Title;
            item.Description = updatedItem.Description;
            item.Location = updatedItem.Location;
            item.Type = updatedItem.Type;
            item.Status = updatedItem.Status;

            await _context.SaveChangesAsync();

            return Ok(item);
        }

        // DELETE: api/items/{id}
        // Delete item
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.Items.FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Item deleted successfully" });
        }
    }
}