#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

# 🔧 Build Stage: .NET SDK + Node.js + build tools
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

# Install Node.js + build tools for npm modules
RUN apt-get update && \
    apt-get install -y curl gnupg make g++ python3 && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app

# Copy and restore
COPY . ./
RUN dotnet restore

# Publish (triggers npm install + npm run build)
RUN dotnet publish -c Release -o out

# 🚀 Runtime
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./

ENTRYPOINT ["dotnet", "FanAlarm.dll"]

