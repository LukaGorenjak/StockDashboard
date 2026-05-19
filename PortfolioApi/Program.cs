using Scalar.AspNetCore;
using PortfolioApi.Models;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod());
});
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=portfolio.db"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();             // registers /openapi/v1.json
    app.MapScalarApiReference();  // serves the Scalar UI at /scalar/v1
}

app.UseHttpsRedirection();
app.UseCors();
app.MapControllers();

app.Run();
