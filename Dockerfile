# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# Copy csproj and restore dependencies
COPY DataPresenter.Server/*.csproj DataPresenter.Server/
COPY datapresenter.client/*.csproj datapresenter.client/ 2>/dev/null || true
RUN dotnet restore DataPresenter.Server/DataPresenter.Server.csproj

# Copy everything else and build
COPY DataPresenter.Server/ DataPresenter.Server/
COPY datapresenter.client/ datapresenter.client/ 2>/dev/null || true
WORKDIR /source/DataPresenter.Server
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

# Konfiguracja portu dla Render
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT:-5000}
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port (Render używa zmiennej $PORT)
EXPOSE ${PORT:-5000}

ENTRYPOINT ["dotnet", "DataPresenter.Server.dll"]