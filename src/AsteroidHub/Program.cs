using AsteroidHub.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSingleton<AsteroidHub.AsteroidHub>();
builder.Services.AddSignalR();
builder.Services.AddHostedService<AsteroidGenerator>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapHub<AsteroidHub.AsteroidHub>("/hub");
app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();


app.Run();
