using FanAlarm.Models;
using FanAlarm;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using FanAlarm.Services.Interfaces;
using FanAlarm.Services.Implementations;
using FanAlarm.Repositories.Interfaces;
using FanAlarm.Repositories.Implementations;
using System;
using Microsoft.Extensions.Logging;

namespace FanAlarm
{
    public class Startup
    {
        private readonly IWebHostEnvironment _env;

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            _env = env;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            services.Configure<AppSettingsModel>(Configuration.GetSection("AppSettings"));

            services.AddScoped<IConcertsSqlServerRepository, ConcertsSqlServerRepository>();
            services.AddScoped<IConcertsSqlServerService, ConcertsSqlServerService>();

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            // Optional: Force redirect to www domain
            app.Use(async (context, next) =>
            {
                if (context.Request.Host.Host.Equals("fanalarm.ca", StringComparison.OrdinalIgnoreCase))
                {
                    var newUrl = $"https://www.fanalarm.ca{context.Request.Path}{context.Request.QueryString}";
                    context.Response.Redirect(newUrl, permanent: true);
                    return;
                }

                await next();
            });

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            // Serve React SPA
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });


        }
    }
}
