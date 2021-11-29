using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

using Newtonsoft.Json.Converters;

using Sb.Api.Authorization;
using Sb.Api.Configuration;
using Sb.Api.Middleware;
using Sb.Api.Services;
using Sb.Email;
using Sb.OAuth2;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
IServiceCollection services = builder.Services;
IConfiguration configuration = builder.Configuration;

services
    .AddOptions()
    .AddHttpContextAccessor()
    .Configure<JwtConfig>(configuration.GetSection("Jwt"))
    .Configure<EmailConfig>(configuration.GetSection("Email"))
    .Configure<SbApiConfig>(configuration.GetSection("SbApi"))
    .AddGoogleOAuth2Client(new ClientCredentials(configuration["Google:ClientId"], configuration["Google:ClientSecret"]))
    .AddFacebookOAuth2Client(new ClientCredentials(configuration["Facebook:AppId"], configuration["Facebook:AppSecret"]))
    .AddSingleton<OAuth2ClientFactory>()
    .AddTransient<BoatService>()
    .AddTransient<EmailService>()
    .AddTransient<TokenBlacklistMiddleware>()
    .AddAuthorization(opts =>
    {
        opts.AddPolicy(AuthorizationPolicies.ReadBoatPolicy, policy =>
            policy.Requirements.Add(new CrewMemberRequirement()));
        opts.AddPolicy(AuthorizationPolicies.EditBoatPolicy, policy =>
            policy.Requirements.Add(new CaptainOrAssistantRequirement()));
        opts.AddPolicy(AuthorizationPolicies.CaptainPolicy, policy =>
            policy.Requirements.Add(new CaptainRequirement()));
    })
    .AddSingleton<IAuthorizationHandler, CrewMemberAuthorizationHandler>()
    .AddSingleton<IAuthorizationHandler, CaptainAuthorizationHandler>()
    .AddSingleton<IAuthorizationHandler, CaptainOrAssistantAuthorizationHandler>()
    .AddCors(opts =>
    {
        opts.AddDefaultPolicy(p =>
        {
            p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        });
    })
    .AddAuthentication(opts =>
    {
        opts.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(opts =>
    {
        opts.SaveToken = true;
        opts.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = false,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
        };
    });

services.AddSbDatabase()
    .AddMongo(opts =>
    {
        opts.ConnectionString = configuration["Mongo:ConnectionString"];
        opts.DatabaseName = configuration["Mongo:DatabaseName"];
    });

services.AddSbEmailClients()
    .AddSendGridClient(opts =>
    {
        opts.ApiKey = configuration["SendGrid:ApiKey"];
    });

services.AddControllers()
    .AddNewtonsoftJson(opts =>
    {
        opts.UseCamelCasing(true);
        opts.SerializerSettings.Converters.Add(new StringEnumConverter());
    });

var app = builder.Build();
IWebHostEnvironment env = builder.Environment;

if (env.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app
    .UseHttpsRedirection()
    .UseRouting()
    .UseCors()
    .UseAuthentication()
    .UseAuthorization()
    .UseMiddleware<TokenBlacklistMiddleware>()
    .UseMiddleware<ExceptionHandlerMiddleware>()
    .UseEndpoints(endpoints => endpoints.MapControllers());

app.Run();
