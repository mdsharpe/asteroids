using AsteroidHub;
using AsteroidHub.Services;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHostedService<AsteroidGenerator>();

builder.Services.AddSignalR();
builder.Services.AddCors();
var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

app.UseCors(o =>
{
    o.WithOrigins("https://delightful-hill-0a63cb603.5.azurestaticapps.net/");
    //o.AllowAnyOrigin();
    o.AllowAnyHeader();
    o.AllowAnyMethod();
    o.AllowCredentials();
});

app.MapHub<AsteroidGameHub>("/hub");

app.Run();
