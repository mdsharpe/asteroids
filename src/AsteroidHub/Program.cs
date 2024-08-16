using AsteroidHub;
using AsteroidHub.Services;
using Microsoft.ApplicationInsights.AspNetCore.Extensions;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

Console.WriteLine("STARTUP");

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHostedService<AsteroidGenerator>();

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://delightful-hill-0a63cb603.5.azurestaticapps.net/")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddApplicationInsightsTelemetry(
    new ApplicationInsightsServiceOptions
    {
        ConnectionString = builder.Configuration["ApplicationInsights:ConnectionString"]
    });
var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

app.UseCors();

app.MapHub<AsteroidGameHub>("/hub");

app.MapGet("ping", () => "pong");


app.Run();
