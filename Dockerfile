# Stage 1: Build Frontend + .NET
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Zainstaluj Node.js (potrzebne do frontendu)
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Ustaw katalog roboczy
WORKDIR /source

# Kopiuj cały kod źródłowy
COPY . .

# --------------------------
# 1️⃣ Budowanie frontendu
# --------------------------
WORKDIR /source/datapresenter.client
RUN npm install
RUN npm run build

# --------------------------
# 2️⃣ Przygotowanie i publikacja .NET
# --------------------------
WORKDIR /source/DataPresenter.Server
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj opublikowaną aplikację z poprzedniego etapu
COPY --from=build /app/publish .

# Konfiguracja portu dla Render
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT:-5000}
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port (Render używa zmiennej $PORT)
EXPOSE ${PORT:-5000}

# Uruchom aplikację
ENTRYPOINT ["dotnet", "DataPresenter.Server.dll"]
