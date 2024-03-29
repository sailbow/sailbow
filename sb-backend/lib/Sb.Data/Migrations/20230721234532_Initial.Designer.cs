﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Sb.Data;

#nullable disable

namespace Sb.Data.Migrations
{
    [DbContext(typeof(SbContext))]
    [Migration("20230721234532_Initial")]
    partial class Initial
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.9")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Sb.Data.Models.BoatBanner", b =>
                {
                    b.Property<Guid>("BoatId")
                        .HasColumnType("uuid");

                    b.Property<int?>("Position")
                        .HasColumnType("integer");

                    b.Property<bool>("Show")
                        .HasColumnType("boolean");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("BoatId");

                    b.ToTable("BoatBanners", (string)null);
                });

            modelBuilder.Entity("Sb.Data.Models.EntityBase", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.ToTable((string)null);

                    b.UseTpcMappingStrategy();
                });

            modelBuilder.Entity("Sb.Data.Models.ModuleOptionVote", b =>
                {
                    b.Property<Guid>("CrewMemberId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("ModuleOptionId")
                        .HasColumnType("uuid");

                    b.HasKey("CrewMemberId", "ModuleOptionId");

                    b.HasIndex("ModuleOptionId");

                    b.ToTable("ModuleOptionVotes", (string)null);
                });

            modelBuilder.Entity("Sb.Data.Models.ModuleSettings", b =>
                {
                    b.Property<Guid>("ModuleId")
                        .HasColumnType("uuid");

                    b.Property<bool>("AllowMultiple")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<bool>("AnonymousVoting")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<DateTime?>("Deadline")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("ModuleId");

                    b.ToTable("ModuleSettings", (string)null);
                });

            modelBuilder.Entity("Sb.Data.Models.Boat", b =>
                {
                    b.HasBaseType("Sb.Data.Models.EntityBase");

                    b.Property<Guid>("CaptainUserId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Description")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(25)
                        .HasColumnType("character varying(25)");

                    b.HasIndex("CaptainUserId");

                    b.ToTable("Boats", (string)null);
                });

            modelBuilder.Entity("Sb.Data.Models.CrewMember", b =>
                {
                    b.HasBaseType("Sb.Data.Models.EntityBase");

                    b.Property<Guid>("BoatId")
                        .HasColumnType("uuid");

                    b.Property<string>("Info")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasIndex("BoatId");

                    b.HasIndex("UserId");

                    b.ToTable("CrewMembers");
                });

            modelBuilder.Entity("Sb.Data.Models.Invite", b =>
                {
                    b.HasBaseType("Sb.Data.Models.EntityBase");

                    b.Property<Guid>("BoatId")
                        .HasColumnType("uuid");

                    b.Property<string>("BoatRole")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasColumnType("text")
                        .HasDefaultValue("Sailor");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("ExpiresUtc")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("InviterId")
                        .HasColumnType("uuid");

                    b.HasIndex("BoatId");

                    b.HasIndex("InviterId");

                    b.ToTable("Invites");
                });

            modelBuilder.Entity("Sb.Data.Models.Module", b =>
                {
                    b.HasBaseType("Sb.Data.Models.EntityBase");

                    b.Property<Guid>("BoatId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("CreatedByCrewMemberId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Description")
                        .HasMaxLength(250)
                        .HasColumnType("character varying(250)");

                    b.Property<Guid?>("FinalizedOptionId")
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<int>("Order")
                        .HasColumnType("integer");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasMaxLength(25)
                        .HasColumnType("character varying(25)");

                    b.HasIndex("BoatId");

                    b.HasIndex("CreatedByCrewMemberId");

                    b.ToTable("Modules");
                });

            modelBuilder.Entity("Sb.Data.Models.ModuleOption", b =>
                {
                    b.HasBaseType("Sb.Data.Models.EntityBase");

                    b.Property<Guid>("CreatedByCrewMemberId")
                        .HasColumnType("uuid");

                    b.Property<string>("Data")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("ModuleId")
                        .HasColumnType("uuid");

                    b.HasIndex("CreatedByCrewMemberId");

                    b.HasIndex("ModuleId");

                    b.ToTable("ModuleOptions");
                });

            modelBuilder.Entity("Sb.Data.Models.User", b =>
                {
                    b.HasBaseType("Sb.Data.Models.EntityBase");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Hash")
                        .HasColumnType("text");

                    b.Property<string>("IdentityProvider")
                        .HasMaxLength(25)
                        .HasColumnType("character varying(25)");

                    b.Property<string>("IdentityProviderId")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasAnnotation("AllowEmptyStrings", false);

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Sb.Data.Models.BoatBanner", b =>
                {
                    b.HasOne("Sb.Data.Models.Boat", "Boat")
                        .WithOne("Banner")
                        .HasForeignKey("Sb.Data.Models.BoatBanner", "BoatId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Boat");
                });

            modelBuilder.Entity("Sb.Data.Models.ModuleOptionVote", b =>
                {
                    b.HasOne("Sb.Data.Models.CrewMember", "CrewMember")
                        .WithMany("Votes")
                        .HasForeignKey("CrewMemberId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Sb.Data.Models.ModuleOption", "ModuleOption")
                        .WithMany("Votes")
                        .HasForeignKey("ModuleOptionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CrewMember");

                    b.Navigation("ModuleOption");
                });

            modelBuilder.Entity("Sb.Data.Models.ModuleSettings", b =>
                {
                    b.HasOne("Sb.Data.Models.Module", "Module")
                        .WithOne("Settings")
                        .HasForeignKey("Sb.Data.Models.ModuleSettings", "ModuleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Module");
                });

            modelBuilder.Entity("Sb.Data.Models.Boat", b =>
                {
                    b.HasOne("Sb.Data.Models.User", "Captain")
                        .WithMany("OwnedBoats")
                        .HasForeignKey("CaptainUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Captain");
                });

            modelBuilder.Entity("Sb.Data.Models.CrewMember", b =>
                {
                    b.HasOne("Sb.Data.Models.Boat", "Boat")
                        .WithMany("Crew")
                        .HasForeignKey("BoatId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Sb.Data.Models.User", "User")
                        .WithMany("CrewMemberships")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Boat");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Sb.Data.Models.Invite", b =>
                {
                    b.HasOne("Sb.Data.Models.Boat", "Boat")
                        .WithMany("Invites")
                        .HasForeignKey("BoatId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Sb.Data.Models.User", "Inviter")
                        .WithMany()
                        .HasForeignKey("InviterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Boat");

                    b.Navigation("Inviter");
                });

            modelBuilder.Entity("Sb.Data.Models.Module", b =>
                {
                    b.HasOne("Sb.Data.Models.Boat", "Boat")
                        .WithMany("Modules")
                        .HasForeignKey("BoatId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Sb.Data.Models.CrewMember", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedByCrewMemberId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Boat");

                    b.Navigation("CreatedBy");
                });

            modelBuilder.Entity("Sb.Data.Models.ModuleOption", b =>
                {
                    b.HasOne("Sb.Data.Models.CrewMember", "CreatedByCrewMember")
                        .WithMany()
                        .HasForeignKey("CreatedByCrewMemberId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Sb.Data.Models.Module", "Module")
                        .WithMany("ModuleOptions")
                        .HasForeignKey("ModuleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CreatedByCrewMember");

                    b.Navigation("Module");
                });

            modelBuilder.Entity("Sb.Data.Models.Boat", b =>
                {
                    b.Navigation("Banner");

                    b.Navigation("Crew");

                    b.Navigation("Invites");

                    b.Navigation("Modules");
                });

            modelBuilder.Entity("Sb.Data.Models.CrewMember", b =>
                {
                    b.Navigation("Votes");
                });

            modelBuilder.Entity("Sb.Data.Models.Module", b =>
                {
                    b.Navigation("ModuleOptions");

                    b.Navigation("Settings");
                });

            modelBuilder.Entity("Sb.Data.Models.ModuleOption", b =>
                {
                    b.Navigation("Votes");
                });

            modelBuilder.Entity("Sb.Data.Models.User", b =>
                {
                    b.Navigation("CrewMemberships");

                    b.Navigation("OwnedBoats");
                });
#pragma warning restore 612, 618
        }
    }
}
