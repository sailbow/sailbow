using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Sb.Data;

public class SbContextFactory : IDesignTimeDbContextFactory<SbContext>
{
    public SbContext CreateDbContext(string[] args)
    {
        if (args.Length < 1)
        {
            throw new ArgumentException("Missing postgres connection string CLI argument");
        }
        var optionsBuilder = new DbContextOptionsBuilder<SbContext>();
        optionsBuilder.UseNpgsql(args[0]);

        return new SbContext(optionsBuilder.Options);
    }
}