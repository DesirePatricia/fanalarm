# --- Build stage with Node + .NET ---
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app

# Install Node.js (16 LTS) for React build
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Copy everything into container
COPY . ./

# Build frontend
WORKDIR /app/ClientApp
RUN npm install
RUN npm run build

# Publish backend (.NET)
WORKDIR /app
RUN dotnet publish -c Release -o out

# --- Runtime stage ---
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/out ./

ENTRYPOINT ["dotnet", "FanAlarm.dll"]
