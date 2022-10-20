#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Sb.Api/Sb.Api.csproj", "Sb.Api/"]
COPY ["lib/Sb.Email/Sb.Email.csproj", "lib/Sb.Email/"]
COPY ["lib/Sb.OAuth2/Sb.OAuth2.csproj", "lib/Sb.OAuth2/"]
COPY ["lib/Sb.HttpClients/Sb.HttpClients.csproj", "lib/Sb.HttpClients/"]
COPY ["lib/Sb.Data/Sb.Data.csproj", "lib/Sb.Data/"]
COPY ["lib/Sb.Data.MongoDB/Sb.Data.MongoDB.csproj", "lib/Sb.Data.MongoDB/"]
RUN dotnet restore "Sb.Api/Sb.Api.csproj"
COPY . .
WORKDIR "/src/Sb.Api"
RUN dotnet build "Sb.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Sb.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Sb.Api.dll"]