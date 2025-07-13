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

ARG REACT_APP_SPOTIFY_CLIENT_ID
ARG REACT_APP_SPOTIFY_REDIRECT_URI
ARG REACT_APP_SPOTIFY_AUTH_ENDPOINT
ARG REACT_APP_SPOTIFY_RESPONSE_TYPE
ARG REACT_APP_SPOTIFY_SCOPE

# Set build args as env vars for npm build
ENV REACT_APP_SPOTIFY_CLIENT_ID=$REACT_APP_SPOTIFY_CLIENT_ID
ENV REACT_APP_SPOTIFY_REDIRECT_URI=$REACT_APP_SPOTIFY_REDIRECT_URI
ENV REACT_APP_SPOTIFY_AUTH_ENDPOINT=$REACT_APP_SPOTIFY_AUTH_ENDPOINT
ENV REACT_APP_SPOTIFY_RESPONSE_TYPE=$REACT_APP_SPOTIFY_RESPONSE_TYPE
ENV REACT_APP_SPOTIFY_SCOPE=$REACT_APP_SPOTIFY_SCOPE

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
