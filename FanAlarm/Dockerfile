# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app

# Copy .NET and React files
COPY . ./

# Install frontend dependencies
WORKDIR /app/ClientApp
RUN npm install
RUN npm run build

# Publish .NET backend
WORKDIR /app
RUN dotnet publish -c Release -o out

# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/out ./
ENTRYPOINT ["dotnet", "FanAlarm.dll"]
