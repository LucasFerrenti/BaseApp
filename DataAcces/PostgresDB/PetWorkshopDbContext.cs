using Entities.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace DataAcces.PostgresDB
{
    public class PetWorkshopDbContext : DbContext
    {
        private readonly IConfiguration _config;
        public PetWorkshopDbContext(DbContextOptions<PetWorkshopDbContext> options, IConfiguration config)
            : base(options)
        {
            _config = config;
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(_config.GetConnectionString("PostgresDB"));
        }
    }
}
