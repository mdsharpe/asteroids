using AsteroidHub;
using AsteroidHub.Services;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHostedService<AsteroidGenerator>();

builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

app.MapHub<AsteroidGameHub>("/hub");

app.Run();
