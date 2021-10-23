using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

using System;
using System.Collections.Generic;

using Sb.OAuth2;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Sb.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddAuthentication(opts =>
                {
                    opts.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    opts.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    opts.DefaultSignOutScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                })
                .AddCookie(opts =>
                {
                    opts.LoginPath = "/unauthorized";
                })
                .AddGoogle(opts =>
                {
                    opts.ClientId = Configuration["Authentication:Google:ClientId"];
                    opts.ClientSecret = Configuration["Authentication:Google:ClientSecret"];
                })
                .AddFacebook(opts =>
                {
                    opts.AppId = Configuration["Authentication:Facebook:AppId"];
                    opts.AppSecret = Configuration["Authentication:Facebook:AppSecret"];
                });

            services.AddAuthorization();
            services.AddCors(opts =>
            {
                opts.AddDefaultPolicy(p =>
                {
                    p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });

            services.AddControllers().AddNewtonsoftJson();

            services.AddGoogleOAuth2Client(new ClientCredentials(Configuration["Authentication:Google:ClientId"], Configuration["Authentication:Google:ClientSecret"]));

            services.AddFacebookOAuth2Client(new ClientCredentials(Configuration["Authentication:Facebook:AppId"], Configuration["Authentication:Facebook:AppSecret"]));

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Sailboat API", Version = "V1" });
                c.AddSecurityDefinition("Google OAuth2", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.OAuth2,
                    Flows = new OpenApiOAuthFlows
                    {
                        AuthorizationCode = new OpenApiOAuthFlow
                        {
                            AuthorizationUrl = new Uri(GoogleDefaults.AuthorizationEndpoint),
                            TokenUrl = new Uri(GoogleDefaults.TokenEndpoint),
                            Scopes = new Dictionary<string, string>
                            {
                                { "https://www.googleapis.com/auth/userinfo.profile", "Basic profile information" }
                            }
                        }
                    }
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sailboat API V1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapSwagger();
                endpoints.MapControllers();
                endpoints.MapGet("/unauthorized", context =>
                {
                    context.Response.StatusCode = 401;
                    return System.Threading.Tasks.Task.CompletedTask;
                });
            });
        }
    }
}
