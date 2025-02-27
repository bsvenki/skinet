using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructue.Data;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        public StoreContext _context { get; set; }
        public GenericRepository(StoreContext context)
        {
            _context = context;
            
        }
        public async Task<T> GetByIdAsync(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }


   
        public async Task<T> GetEntityWithSpec(ISpecification<T> spec)
        {
           return await ApplySpecification(spec).FirstOrDefaultAsync();
        }

        
        public async Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).ToListAsync();
        }

        public async Task<IReadOnlyList<T>> ListAllAsync()
        {
           return await _context.Set<T>().ToListAsync();
        } 


        public async Task<IReadOnlyList<T>> ListAllAsync(Func<IQueryable<T>, IQueryable<T>> include = null)
        {
            IQueryable<T> query = _context.Set<T>();

            // Apply the Include expression if provided
            if (include != null)
            {
                query = include(query);
            }

            return await query.ToListAsync();
        }      

        public async Task<int> CounAsync(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).CountAsync();
        }

         private IQueryable<T> ApplySpecification(ISpecification<T> spec)
        {
            return SpecificationEvaluator<T>.GetQuery(_context.Set<T>().AsQueryable(),spec);
        }

        public void Add(T entity)
        {
            _context.Set<T>().Add(entity);
        }

        public void Update(T entity)
        {
            _context.Set<T>().Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
        }

        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
        }
    }
}