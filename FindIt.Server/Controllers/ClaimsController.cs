using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FindIt.Server.Data;
using FindIt.Server.Models;

namespace FindIt.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaimsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClaimsController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/claims
        // Create a new claim
        [HttpPost]
        public async Task<ActionResult<Claim>> CreateClaim(Claim claim)
        {
            claim.Status = "Pending";
            claim.CreatedAt = DateTime.UtcNow;

            _context.Claims.Add(claim);
            await _context.SaveChangesAsync();

            return Ok(claim);
        }

        // GET: api/claims/item/{itemId}
        // Get all claims for a specific item
        [HttpGet("item/{itemId}")]
        public async Task<ActionResult<IEnumerable<Claim>>> GetClaimsForItem(int itemId)
        {
            var claims = await _context.Claims
                .Include(c => c.User)
                .Where(c => c.ItemId == itemId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return Ok(claims);
        }

        // GET: api/claims/user/{userId}
        // Get all claims submitted by a user
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Claim>>> GetClaimsByUser(int userId)
        {
            var claims = await _context.Claims
                .Include(c => c.Item)
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return Ok(claims);
        }

        // PUT: api/claims/{id}/approve
        // Approve a claim
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveClaim(int id)
        {
            var claim = await _context.Claims
                .Include(c => c.Item)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (claim == null)
                return NotFound();

            claim.Status = "Approved";

            if (claim.Item != null)
            {
                claim.Item.Status = "Returned";
            }

            await _context.SaveChangesAsync();

            return Ok(claim);
        }

        // PUT: api/claims/{id}/reject
        // Reject a claim
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectClaim(int id)
        {
            var claim = await _context.Claims.FindAsync(id);

            if (claim == null)
                return NotFound();

            claim.Status = "Rejected";

            await _context.SaveChangesAsync();

            return Ok(claim);
        }
    }
}