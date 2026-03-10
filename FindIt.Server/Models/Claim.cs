namespace FindIt.Server.Models;

public class Claim
{
    public int Id { get; set; }

    public int ItemId { get; set; }

    public Item? Item { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    public string Message { get; set; } = "";

    public string Status { get; set; } = "Pending";
}


