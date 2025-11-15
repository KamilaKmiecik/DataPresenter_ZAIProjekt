# Stage 1: Build Frontend + .NET
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Instalacja Node.js (potrzebne do frontendu)
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /source

# --------------------------
# 1️⃣ Frontend build
# --------------------------
# Kopiowanie tylko package.json i package-lock.json do cache
COPY datapresenter.client/package*.json ./datapresenter.client/
WORKDIR /source/datapresenter.client
RUN npm install

# Kopiowanie reszty frontendu i build
COPY datapresenter.client/ ./
RUN npm run build

# --------------------------
# 2️⃣ Backend .NET build
# --------------------------
WORKDIR /source/DataPresenter.Server
# Kopiowanie tylko plików csproj dla cache NuGet
COPY DataPresenter.Server/*.csproj ./
RUN dotnet restore

# Kopiowanie reszty backendu i publikacja
COPY DataPresenter.Server/ ./
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Konfiguracja portu dla Render
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT:-5000}
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE ${PORT:-5000}

ENTRYPOINT ["dotnet", "DataPresenter.Server.dll"]
