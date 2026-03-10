using Microsoft.AspNetCore.Http;

namespace FindIt.Server.DTOs
{
    public class ItemCreateDto
    {
        public string Title { get; set; } = "";

        public string Description { get; set; } = "";

        public string Location { get; set; } = "";

        public string Type { get; set; } = "";

        public int UserId { get; set; }

        public IFormFile? Image { get; set; }
    }
}