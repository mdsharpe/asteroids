using AsteroidHub;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHostedService<AsteroidGenerator>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:4200",
                "https://delightful-hill-0a63cb603.5.azurestaticapps.net/",
                "https://asteroids.mdsharpe.com")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddSignalR();

var app = builder.Build();

if (!builder.Environment.IsDevelopment())
{
    // Configure the HTTP request pipeline.
    app.UseHttpsRedirection();
}

app.UseCors();

app.MapHub<AsteroidGameHub>("/hub");

app.Run();
