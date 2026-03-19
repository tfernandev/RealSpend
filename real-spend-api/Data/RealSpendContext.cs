using Microsoft.EntityFrameworkCore;
using RealSpend.Api.Models;

namespace RealSpend.Api.Data
{
    public class RealSpendContext : DbContext
    {
        public RealSpendContext(DbContextOptions<RealSpendContext> options) : base(options) { }

        public DbSet<IpcIndex> IpcIndices { get; set; } = null!;
        public DbSet<BudgetVersion> BudgetVersions { get; set; } = null!;
        public DbSet<BudgetEntry> BudgetEntries { get; set; } = null!;
        public DbSet<EventLog> Events { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IpcIndex>().HasKey(x => x.Period);
            
            modelBuilder.Entity<BudgetVersion>()
                .HasMany(bv => bv.Entries)
                .WithOne(be => be.Version)
                .HasForeignKey(be => be.BudgetVersionId);

            modelBuilder.Entity<BudgetEntry>()
                .HasIndex(be => new { be.Period, be.ProgramId });

            base.OnModelCreating(modelBuilder);
        }
    }
}
