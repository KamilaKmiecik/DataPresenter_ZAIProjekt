using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DataPresenter.Server.Migrations
{
    /// <inheritdoc />
    public partial class CheckChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Series",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MinValue = table.Column<double>(type: "float", nullable: false),
                    MaxValue = table.Column<double>(type: "float", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Color = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Series", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastLogin = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sensors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ApiKey = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SeriesId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastDataReceived = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sensors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sensors_Series_SeriesId",
                        column: x => x.SeriesId,
                        principalTable: "Series",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Measurements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<double>(type: "float", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SeriesId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    SensorId = table.Column<int>(type: "int", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Measurements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Measurements_Sensors_SensorId",
                        column: x => x.SensorId,
                        principalTable: "Sensors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Measurements_Series_SeriesId",
                        column: x => x.SeriesId,
                        principalTable: "Series",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Measurements_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.InsertData(
                table: "Series",
                columns: new[] { "Id", "Color", "CreatedAt", "Description", "Icon", "IsActive", "MaxValue", "MinValue", "Name", "Unit" },
                values: new object[,]
                {
                    { 1, "#EF4444", new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Pomiar temperatury w pomieszczeniach", "thermometer", true, 50.0, -10.0, "Temperatura pokojowa", "°C" },
                    { 2, "#3B82F6", new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Pomiar wilgotności względnej", "droplet", true, 100.0, 0.0, "Wilgotność powietrza", "%" },
                    { 3, "#10B981", new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Pomiar ciśnienia powietrza", "gauge", true, 1050.0, 950.0, "Ciśnienie atmosferyczne", "hPa" },
                    { 4, "#FBBF24", new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Pomiar jasności otoczenia", "sun", true, 10000.0, 0.0, "Natężenie światła", "lx" },
                    { 5, "#6B7280", new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Pomiar dwutlenku węgla w powietrzu", "cloud", true, 2000.0, 300.0, "Stężenie CO₂", "ppm" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "LastLogin", "PasswordHash", "Username" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@example.com", null, "$2a$11$zA2MzBfG5URvZ7.RZoP9.O3UQprC5ZBlhz6ZcY5aJrk0Gq2a4u0yW", "admin" },
                    { 2, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "jan.kowalski@example.com", null, "$2a$11$testhash000000000000000000000000000000000000000000000000", "jan_kowalski" },
                    { 3, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "anna.nowak@example.com", null, "$2a$11$testhash111111111111111111111111111111111111111111111111", "anna_nowak" }
                });

            migrationBuilder.InsertData(
                table: "Sensors",
                columns: new[] { "Id", "ApiKey", "CreatedAt", "Description", "IsActive", "LastDataReceived", "Name", "SeriesId" },
                values: new object[,]
                {
                    { 1, "TEMP_SALON_KEY", new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Czujnik DHT22 w salonie", true, null, "Sensor temperatury - Salon", 1 },
                    { 2, "HUM_SALON_KEY", new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Czujnik DHT22 w salonie", true, null, "Sensor wilgotności - Salon", 2 },
                    { 3, "PRESS_OUT_KEY", new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Czujnik BMP180 na balkonie", true, null, "Sensor ciśnienia - Balkon", 3 },
                    { 4, "LIGHT_OFFICE_KEY", new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Czujnik LDR w biurze", true, null, "Sensor światła - Biuro", 4 },
                    { 5, "CO2_KITCHEN_KEY", new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Czujnik MH-Z19B w kuchni", true, null, "Sensor CO2 - Kuchnia", 5 }
                });

            migrationBuilder.InsertData(
                table: "Measurements",
                columns: new[] { "Id", "CreatedAt", "Notes", "SensorId", "SeriesId", "Timestamp", "UserId", "Value" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 1, 1, new DateTime(2024, 11, 1, 6, 0, 0, 0, DateTimeKind.Utc), 2, 22.399999999999999 },
                    { 2, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 1, 1, new DateTime(2024, 11, 1, 12, 0, 0, 0, DateTimeKind.Utc), 2, 23.100000000000001 },
                    { 3, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 1, 1, new DateTime(2024, 11, 2, 6, 0, 0, 0, DateTimeKind.Utc), 3, 24.5 },
                    { 4, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 2, 2, new DateTime(2024, 11, 1, 6, 0, 0, 0, DateTimeKind.Utc), 2, 48.299999999999997 },
                    { 5, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 2, 2, new DateTime(2024, 11, 1, 12, 0, 0, 0, DateTimeKind.Utc), 1, 51.799999999999997 },
                    { 6, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 2, 2, new DateTime(2024, 11, 2, 6, 0, 0, 0, DateTimeKind.Utc), 3, 55.200000000000003 },
                    { 7, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 3, 3, new DateTime(2024, 11, 1, 6, 0, 0, 0, DateTimeKind.Utc), 1, 1013.2 },
                    { 8, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 3, 3, new DateTime(2024, 11, 1, 12, 0, 0, 0, DateTimeKind.Utc), 2, 1011.7 },
                    { 9, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 3, 3, new DateTime(2024, 11, 2, 6, 0, 0, 0, DateTimeKind.Utc), 3, 1008.5 },
                    { 10, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 4, 4, new DateTime(2024, 11, 1, 8, 0, 0, 0, DateTimeKind.Utc), 1, 320.0 },
                    { 11, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 4, 4, new DateTime(2024, 11, 1, 14, 0, 0, 0, DateTimeKind.Utc), 1, 750.0 },
                    { 12, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 4, 4, new DateTime(2024, 11, 1, 22, 0, 0, 0, DateTimeKind.Utc), 1, 50.0 },
                    { 13, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 5, 5, new DateTime(2024, 11, 1, 6, 0, 0, 0, DateTimeKind.Utc), 1, 420.0 },
                    { 14, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 5, 5, new DateTime(2024, 11, 1, 12, 0, 0, 0, DateTimeKind.Utc), 1, 780.0 },
                    { 15, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 5, 5, new DateTime(2024, 11, 1, 18, 0, 0, 0, DateTimeKind.Utc), 3, 610.0 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Measurements_SensorId",
                table: "Measurements",
                column: "SensorId");

            migrationBuilder.CreateIndex(
                name: "IX_Measurements_SeriesId",
                table: "Measurements",
                column: "SeriesId");

            migrationBuilder.CreateIndex(
                name: "IX_Measurements_Timestamp",
                table: "Measurements",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_Measurements_UserId",
                table: "Measurements",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Sensors_ApiKey",
                table: "Sensors",
                column: "ApiKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sensors_SeriesId",
                table: "Sensors",
                column: "SeriesId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Measurements");

            migrationBuilder.DropTable(
                name: "Sensors");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Series");
        }
    }
}
