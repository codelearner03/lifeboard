FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["LifeBoard.API.csproj", "."]
RUN dotnet restore "LifeBoard.API.csproj"
COPY . .
RUN dotnet build "LifeBoard.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LifeBoard.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LifeBoard.API.dll"]