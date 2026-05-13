FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY backend/LifeBoard.API/LifeBoard.API/. .
RUN dotnet restore "LifeBoard.API.csproj"
RUN dotnet publish "LifeBoard.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "LifeBoard.API.dll"]