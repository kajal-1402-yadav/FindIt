namespace FindIt.Server.Models;

public class Item
{
    public int Id { get; set; }

    public string Title { get; set; } = "";

    public string Description { get; set; } = "";

    public string Location { get; set; } = "";

    public DateTime Date { get; set; }

    public string Type { get; set; } = "";
    // Lost or Found

    public string Status { get; set; } = "Open";
    // Open, Claimed, Returned

    public string? ImageUrl { get; set; }
    // path of uploaded image

    public int UserId { get; set; }

    public User? User { get; set; }
}