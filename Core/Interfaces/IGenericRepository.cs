using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<T> GetByIdAsync(int id);
        Task<IReadOnlyList<T>> ListAllAsync();

        Task<IReadOnlyList<T>> ListAllAsync(Func<IQueryable<T>, IQueryable<T>> include = null);

        Task<T> GetEntityWithSpec(ISpecification<T> spec);
        Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);

        

        Task<int> CounAsync(ISpecification<T> spec);

        void Add(T entity);

        void Update(T entity);

        void Delete(T entitjy);
    }
}