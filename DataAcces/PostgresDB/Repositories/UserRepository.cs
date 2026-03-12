using DataAcces.PostgresDB.Repositories.Interfaces;
using Entities.Database;
using Microsoft.EntityFrameworkCore;

namespace DataAcces.PostgresDB.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(PetWorkshopDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
