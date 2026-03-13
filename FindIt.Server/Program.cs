using FindIt.Server.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

// Enable CORS for Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200", 
                             "http://localhost:65194",
                             "https://localhost:4200",
                             "https://localhost:65194",
                             "http://localhost:5167",
                             "https://localhost:5167")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// Register DbContext with support for both SQL Server and SQLite
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var useSqlite = builder.Configuration.GetValue<bool>("UseSqlite", false);

if (useSqlite || string.IsNullOrEmpty(connectionString) || !connectionString.Contains("mssqllocaldb"))
{
    // Use SQLite for development or when SQL Server is not available
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite(builder.Configuration.GetConnectionString("SqliteConnection") ?? "Data Source=FindIt.db"));
}
else
{
    // Use SQL Server when available
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(connectionString));
}

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Development tools
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();

    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "FindIt API V1");
        c.RoutePrefix = "swagger";
    });

}

// app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors("AllowAngular");

app.MapControllers();

app.UseAuthorization();

app.Run();