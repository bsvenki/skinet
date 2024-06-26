using API.Extensions;
using API.Middleware;
using Core.Entities.Identity;
using Infrastructue.Data;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var  CorsPolicy = "_corsPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CorsPolicy,
                      policy  =>
                      {
                          policy.WithOrigins("https://localhost:4200");                          
                      });
});

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddSwaggerDocumentation();


/*
// Moved to Extensions ApplicationServices

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<StoreContext>(opt => 
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddScoped<IProductRepository,ProductRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = actionContext =>
    {
        var errors = actionContext.ModelState
                        .Where(e => e.Value.Errors.Count > 0)
                        .SelectMany(x => x.Value.Errors)
                        .Select(x => x.ErrorMessage).ToArray();
    
        var errorResponse = new ApiValidationErrorResponse
        {
            Errors = errors
        };
        return new BadRequestObjectResult(errorResponse);
    };
});
*/

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseStatusCodePagesWithRedirects("/erros/{0}");


app.UseSwaggerDocumentation();

app.UseStaticFiles();

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();


// Execute EF migrations using code

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var context = services.GetRequiredService<StoreContext>();
var identityContext = services.GetRequiredService<AppIdentityDbContext>();
var userManager = services.GetRequiredService<UserManager<AppUser>>();

var logger = services.GetRequiredService<ILogger<Program>>();
try
{
    await context.Database.MigrateAsync();
    await identityContext.Database.MigrateAsync();

    await StoreContextSeed.SeedAsyn(context);
    await AppIdentityDbContextSeed.SeedUsersAsync(userManager);
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occured during migration");
} 

app.Run();
