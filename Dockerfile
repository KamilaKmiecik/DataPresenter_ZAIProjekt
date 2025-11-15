# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Install Node.js (potrzebne do frontendu)
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /source

# Copy everything
COPY . .

# Install npm dependencies for frontend
WORKDIR /source/datapresenter.client
RUN npm install

# Restore .NET dependencies
WORKDIR /source/DataPresenter.Server
RUN dotnet restore

# Build and publish
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