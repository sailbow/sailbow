using System.Text;
using System.Text.Json;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;

using Sb.Api.Configuration;
using Sb.Api.Middleware;
using Sb.Api.Services;
using Sb.Data;
using Sb.Email;
using Sb.OAuth2;
using System.Text.Json.Serialization;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
IServiceCollection services = builder.Services;
IConfiguration configuration = builder.Configuration;

services
    .AddOptions()
    .AddHttpContextAccessor()
    .AddDbContext<SbContext>(opts =>
    {
        opts.UseNpgsql(configuration.GetConnectionString("SbPostgres"));
    })
    .AddSwaggerGen(opts =>
    {
        opts.UseOneOfForPolymorphism();
        opts.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "Please enter a valid token",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "Bearer"
        });
        opts.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type=ReferenceType.SecurityScheme,
                        Id="Bearer"
                    }
                },
                new string[] { }
            }
        });
    })
    .Configure<JwtConfig>(configuration.GetSection("Jwt"))
    .Configure<EmailConfig>(configuration.GetSection("Email"))
    .Configure<SbApiConfig>(configuration.GetSection("SbApi"))
    .AddGoogleOAuth2Client(new ClientCredentials(configuration["Google:ClientId"], configuration["Google:ClientSecret"]))
    .AddFacebookOAuth2Client(new ClientCredentials(configuration["Facebook:AppId"], configuration["Facebook:AppSecret"]))
    .AddSingleton<OAuth2ClientFactory>()
    .AddTransient<BoatService>()
    .AddTransient<EmailService>()
    .AddTransient<ITokenService, TokenService>()
    .AddTransient<IUserService, UserService>()
    .AddTransient<ModuleService>()
    .AddAutoMapper(typeof(Program).Assembly)
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

services.AddSbEmailClients()
    .AddSendGridClient(opts =>
    {
        opts.ApiKey = configuration["SendGrid:ApiKey"];
    });

services.AddSbHttpClients()
    .AddUnsplash(opts =>
    {
        opts.ClientId = configuration["Unsplash:ClientId"];
    });

services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    });

var app = builder.Build();
IWebHostEnvironment env = builder.Environment;

if (env.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app
    .UseRouting()
    .UseCors()
    .UseAuthentication()
    .UseAuthorization()
    .UseMiddleware<ExceptionHandlerMiddleware>()
    .UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
        if (env.IsDevelopment())
        {
            endpoints
                .MapSwagger()
                .AllowAnonymous();
        }
    });

app.Run();
