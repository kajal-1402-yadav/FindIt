using System.ComponentModel.DataAnnotations;

namespace FindIt.Server.DTOs
{
    public class DeleteAccountDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = "";

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = "";
    }
}
