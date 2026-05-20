# Stage 1 – build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY PortfolioApi/PortfolioApi.csproj PortfolioApi/
RUN dotnet restore PortfolioApi/PortfolioApi.csproj

COPY PortfolioApi/ PortfolioApi/
RUN dotnet publish PortfolioApi/PortfolioApi.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# Stage 2 – runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

RUN mkdir -p /app/data

EXPOSE 8080

ENTRYPOINT ["dotnet", "PortfolioApi.dll"]
