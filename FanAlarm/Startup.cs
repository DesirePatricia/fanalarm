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
            var appSettingsSection = Configuration.GetSection("AppSettings");
            var appSettingsModel = appSettingsSection.Get<AppSettingsModel>();
            services.Configure<AppSettingsModel>(appSettingsSection);
            services.AddControllersWithViews();
            services.AddScoped<IConcertsSqlServerRepository, ConcertsSqlServerRepository>();
            services.AddScoped<IConcertsSqlServerService, ConcertsSqlServerService>();
            services.AddSingleton<IConcertsSqlServerRepository, ConcertsSqlServerRepository>();
            services.AddSingleton<IConcertsSqlServerService, ConcertsSqlServerService>();
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.MapWhen(context => context.Request.Path == "/", builder =>
            {
                builder.Run(async ctx => await ctx.Response.WriteAsync("OK"));
            });

            app.Use(async (context, next) =>
            {
                logger.LogInformation("Incoming Host: " + context.Request.Host.Host);

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
