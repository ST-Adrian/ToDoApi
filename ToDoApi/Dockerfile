# Usa la imagen oficial de .NET para compilar
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copia los archivos del proyecto y restaura dependencias
COPY *.csproj ./
RUN dotnet restore

# Copia el resto del código y compila
COPY . ./
RUN dotnet publish -c Release -o out

# Usa la imagen liviana de ASP.NET para ejecutar
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Configura el puerto y el comando de inicio
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "ToDoApi.dll"]