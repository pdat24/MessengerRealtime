using server.Db;
using server.Hubs;
using server.Utils;

var builder = WebApplication.CreateBuilder(args);
    
// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();
builder.Services.AddScoped<AppDB>();
builder.Services.AddSingleton<IUtilsContainer, UtilsContainer>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("clientApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000");
        policy.WithHeaders("Content-Type");
        policy.AllowCredentials().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseCors("clientApp");

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapDefaultControllerRoute();
app.MapHub<ChatHub>("/hub/chat");

app.Run();
