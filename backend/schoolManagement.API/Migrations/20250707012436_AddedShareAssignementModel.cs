using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace schoolManagement.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedShareAssignementModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SharedAssignments",
                columns: table => new
                {
                    SharedAssignmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssignmentId = table.Column<int>(type: "int", nullable: false),
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SharedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SharedAssignments", x => x.SharedAssignmentId);
                    table.ForeignKey(
                        name: "FK_SharedAssignments_Assignments_AssignmentId",
                        column: x => x.AssignmentId,
                        principalTable: "Assignments",
                        principalColumn: "AssignmentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SharedAssignments_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SharedAssignments_AssignmentId",
                table: "SharedAssignments",
                column: "AssignmentId");

            migrationBuilder.CreateIndex(
                name: "IX_SharedAssignments_StudentId",
                table: "SharedAssignments",
                column: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SharedAssignments");
        }
    }
}
