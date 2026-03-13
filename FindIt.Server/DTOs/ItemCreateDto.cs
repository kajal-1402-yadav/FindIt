using System.ComponentModel.DataAnnotations;

namespace FindIt.Server.DTOs
{
    public class ItemCreateDto
    {
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = "";

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = "";

        [Required(ErrorMessage = "Location is required")]
        public string Location { get; set; } = "";

        [Required(ErrorMessage = "Type is required")]
        [RegularExpression("^(Lost|Found)$", ErrorMessage = "Type must be either 'Lost' or 'Found'")]
        public string Type { get; set; } = "";

        [Range(1, int.MaxValue, ErrorMessage = "Valid user ID is required")]
        public int UserId { get; set; }
    }

    public class ItemResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public string Location { get; set; } = "";
        public DateTime Date { get; set; }
        public string Type { get; set; } = "";
        public string Status { get; set; } = "";
        public int UserId { get; set; }
    }
}