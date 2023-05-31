using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Sb.Data;

public class SbContextFactory : IDesignTimeDbContextFactory<SbContext>
{
    public SbContext CreateDbContext(string[] args)
    {
        Console.WriteLine(string.Join("; ", args));
        var optionsBuilder = new DbContextOptionsBuilder<SbContext>();
        optionsBuilder.UseNpgsql(args[0]);

        return new SbContext(optionsBuilder.Options);
    }
}
