FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["backend/LifeBoard.API/LifeBoard.API/LifeBoard.API.csproj", "LifeBoard.API/"]
RUN dotnet restore "LifeBoard.API/LifeBoard.API.csproj"
COPY backend/LifeBoard.API/LifeBoard.API/. LifeBoard.API/
WORKDIR "/src/LifeBoard.API"
RUN dotnet build "LifeBoard.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LifeBoard.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LifeBoard.API.dll"]