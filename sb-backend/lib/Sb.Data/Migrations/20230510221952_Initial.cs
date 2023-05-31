using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Sb.Data.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IdentityProviders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IdentityProviders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Hash = table.Column<string>(type: "text", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Boats",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(25)", maxLength: 25, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    CaptainUserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Boats", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Boats_Users_CaptainUserId",
                        column: x => x.CaptainUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ConnectedAccounts",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    IdentityProviderId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConnectedAccounts", x => new { x.UserId, x.IdentityProviderId });
                    table.ForeignKey(
                        name: "FK_ConnectedAccounts_IdentityProviders_IdentityProviderId",
                        column: x => x.IdentityProviderId,
                        principalTable: "IdentityProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConnectedAccounts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BoatBanners",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BoatId = table.Column<Guid>(type: "uuid", nullable: false),
                    Show = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    Type = table.Column<string>(type: "text", nullable: false, defaultValue: "Color"),
                    Value = table.Column<string>(type: "text", nullable: true),
                    Position = table.Column<int>(type: "integer", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoatBanners", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BoatBanners_Boats_BoatId",
                        column: x => x.BoatId,
                        principalTable: "Boats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BoatCodes",
                columns: table => new
                {
                    BoatId = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoatCodes", x => x.BoatId);
                    table.ForeignKey(
                        name: "FK_BoatCodes_Boats_BoatId",
                        column: x => x.BoatId,
                        principalTable: "Boats",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CrewMembers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BoatId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    Info = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CrewMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CrewMembers_Boats_BoatId",
                        column: x => x.BoatId,
                        principalTable: "Boats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CrewMembers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ModuleOptionVotes",
                columns: table => new
                {
                    CrewMemberId = table.Column<Guid>(type: "uuid", nullable: false),
                    ModuleOptionId = table.Column<Guid>(type: "uuid", nullable: false),
                    ModuleOptionId1 = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ModuleOptionVotes", x => new { x.CrewMemberId, x.ModuleOptionId });
                    table.ForeignKey(
                        name: "FK_ModuleOptionVotes_CrewMembers_CrewMemberId",
                        column: x => x.CrewMemberId,
                        principalTable: "CrewMembers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Modules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BoatId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedByCrewMemberId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    FinalizedOptionId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Modules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Modules_Boats_BoatId",
                        column: x => x.BoatId,
                        principalTable: "Boats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Modules_CrewMembers_CreatedByCrewMemberId",
                        column: x => x.CreatedByCrewMemberId,
                        principalTable: "CrewMembers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DateModuleOptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ModuleId = table.Column<Guid>(type: "uuid", nullable: false),
                    AuthorId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DateModuleOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DateModuleOptions_CrewMembers_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "CrewMembers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DateModuleOptions_Modules_ModuleId",
                        column: x => x.ModuleId,
                        principalTable: "Modules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LocationModuleOptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ModuleId = table.Column<Guid>(type: "uuid", nullable: false),
                    AuthorId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocationModuleOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LocationModuleOptions_CrewMembers_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "CrewMembers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LocationModuleOptions_Modules_ModuleId",
                        column: x => x.ModuleId,
                        principalTable: "Modules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ModuleSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AllowMultiple = table.Column<bool>(type: "boolean", nullable: false),
                    AnonymousVoting = table.Column<bool>(type: "boolean", nullable: false),
                    Deadline = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ModuleId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ModuleSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ModuleSettings_Modules_ModuleId",
                        column: x => x.ModuleId,
                        principalTable: "Modules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "IdentityProviders",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Google" },
                    { 2, "Facebook" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_BoatBanners_BoatId",
                table: "BoatBanners",
                column: "BoatId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BoatCodes_Value",
                table: "BoatCodes",
                column: "Value",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Boats_CaptainUserId",
                table: "Boats",
                column: "CaptainUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ConnectedAccounts_IdentityProviderId",
                table: "ConnectedAccounts",
                column: "IdentityProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_CrewMembers_BoatId",
                table: "CrewMembers",
                column: "BoatId");

            migrationBuilder.CreateIndex(
                name: "IX_CrewMembers_UserId",
                table: "CrewMembers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DateModuleOptions_AuthorId",
                table: "DateModuleOptions",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_DateModuleOptions_ModuleId",
                table: "DateModuleOptions",
                column: "ModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_LocationModuleOptions_AuthorId",
                table: "LocationModuleOptions",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_LocationModuleOptions_ModuleId",
                table: "LocationModuleOptions",
                column: "ModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_ModuleOptionVotes_ModuleOptionId",
                table: "ModuleOptionVotes",
                column: "ModuleOptionId");

            migrationBuilder.CreateIndex(
                name: "IX_ModuleOptionVotes_ModuleOptionId1",
                table: "ModuleOptionVotes",
                column: "ModuleOptionId1");

            migrationBuilder.CreateIndex(
                name: "IX_Modules_BoatId",
                table: "Modules",
                column: "BoatId");

            migrationBuilder.CreateIndex(
                name: "IX_Modules_CreatedByCrewMemberId",
                table: "Modules",
                column: "CreatedByCrewMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Modules_FinalizedOptionId",
                table: "Modules",
                column: "FinalizedOptionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ModuleSettings_ModuleId",
                table: "ModuleSettings",
                column: "ModuleId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BoatBanners");

            migrationBuilder.DropTable(
                name: "BoatCodes");

            migrationBuilder.DropTable(
                name: "ConnectedAccounts");

            migrationBuilder.DropTable(
                name: "DateModuleOptions");

            migrationBuilder.DropTable(
                name: "LocationModuleOptions");

            migrationBuilder.DropTable(
                name: "ModuleOptionVotes");

            migrationBuilder.DropTable(
                name: "ModuleSettings");

            migrationBuilder.DropTable(
                name: "IdentityProviders");

            migrationBuilder.DropTable(
                name: "Modules");

            migrationBuilder.DropTable(
                name: "CrewMembers");

            migrationBuilder.DropTable(
                name: "Boats");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
