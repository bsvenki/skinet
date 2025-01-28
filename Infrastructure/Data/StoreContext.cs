using System.Reflection;
using Core.Entities;
using Core.Entities.AppointmentAgreegate;
using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Infrastructue.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions<StoreContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductBrand> ProductBrands { get; set; }

        public DbSet<ProductType> ProductTypes { get; set; }

        public DbSet<Order> Orders  {get; set;}

        public DbSet<OrderItem> OrderItems { get; set; }

        public DbSet<DeliveryMethod> DeliveryMethods { get; set; }

       
        public DbSet<Patient> Patients { get; set; }
        public DbSet<BookingType> BookingTypes { get; set; }
        public DbSet<TherapyCategory> TherapyCategories { get; set; }
        public DbSet<Therapy> Therapies { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Therapist> Therapists { get; set; }
        public DbSet<TherapistTherapy> TherapistTherapies  { get; set; }
        public DbSet<Appointment> Appointments { get; set; }

        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

           
            modelBuilder.Entity<Patient>().HasData(new Patient { Id = 1, Name = "Patient1" });
            modelBuilder.Entity<Patient>().HasData(new Patient { Id = 2, Name = "Patient2" });
            modelBuilder.Entity<Patient>().HasData(new Patient { Id = 3, Name = "Patient3" });

            modelBuilder.Entity<BookingType>().HasData(new BookingType { Id = 1, Name = "Consulting" });
            modelBuilder.Entity<BookingType>().HasData(new BookingType { Id = 2, Name = "Therapy" });

            modelBuilder.Entity<TherapyCategory>().HasData(new TherapyCategory { Id = 1, Name = "Ayurveda" });
            modelBuilder.Entity<TherapyCategory>().HasData(new TherapyCategory { Id = 2, Name = "Sleep" });

            modelBuilder.Entity<Therapy>().HasData(new Therapy { Id = 1, TherapyCategoryId=1, Name = "Panchakarma" });
            modelBuilder.Entity<Therapy>().HasData(new Therapy { Id = 2, TherapyCategoryId=1, Name = "Shirodhara" });
            modelBuilder.Entity<Therapy>().HasData(new Therapy { Id = 3, TherapyCategoryId=1, Name = "Abhyanga" });
            modelBuilder.Entity<Therapy>().HasData(new Therapy { Id = 4, TherapyCategoryId=2, Name = "Insomnia" });
            modelBuilder.Entity<Therapy>().HasData(new Therapy { Id = 5, TherapyCategoryId=2, Name = "Relaxation techniques" });

           
            modelBuilder.Entity<Doctor>().HasData(new Doctor { Id = 1,   Name = "Doctor1" });
            modelBuilder.Entity<Doctor>().HasData(new Doctor { Id = 2,   Name = "Doctor2" });
            modelBuilder.Entity<Doctor>().HasData(new Doctor { Id = 3,   Name = "Doctor3" });

            modelBuilder.Entity<TherapistTherapy>().HasData(new TherapistTherapy { Id = 1, TherapyId=1, TherapistId=1  });
            modelBuilder.Entity<TherapistTherapy>().HasData(new TherapistTherapy { Id = 2, TherapyId=2, TherapistId=1  });
            modelBuilder.Entity<TherapistTherapy>().HasData(new TherapistTherapy { Id = 3, TherapyId=3, TherapistId=2  });
            modelBuilder.Entity<TherapistTherapy>().HasData(new TherapistTherapy { Id = 4, TherapyId=4, TherapistId=3  });
            modelBuilder.Entity<TherapistTherapy>().HasData(new TherapistTherapy { Id = 5, TherapyId=5, TherapistId=3  });
            modelBuilder.Entity<TherapistTherapy>().HasData(new TherapistTherapy { Id = 6, TherapyId=1, TherapistId=2  });

            modelBuilder.Entity<Appointment>().HasData(new Appointment { Id = 1, PatientId=1, BookingTypeId=1, TherapyCategoryId=0, TherapistTherapyId=0,  DoctorId=1,Title="Demo Title1", Startdate=DateTime.Now.AddDays(1),Enddate=DateTime.Now.AddDays(1).AddMinutes(30), Status="Confirmed" });
            

            //modelBuilder.Entity<TherapyCategory>().HasMany(a => a.Therapys) .WithOne().HasForeignKey("TherapyCategoryId").OnDelete(DeleteBehavior.Cascade).IsRequired();
            
          
            modelBuilder.Entity<TherapistTherapy>()
                .HasKey(tt => new { tt.TherapistId, tt.TherapyId }); // Composite primary key

            modelBuilder.Entity<TherapistTherapy>()
                .HasOne(tt => tt.Therapist)
                .WithMany(t => t.TherapistTherapies)
                .HasForeignKey(tt => tt.TherapistId);

            modelBuilder.Entity<TherapistTherapy>()
                .HasOne(tt => tt.Therapy)
                .WithMany(t => t.TherapistTherapies)
                .HasForeignKey(tt => tt.TherapyId);

           
            
                
            
            //.UsingEntity(j => j.ToTable("TherapistTherapys")); // Optional: name of the join table
            

            /*
            modelBuilder.Entity<Therapy>()
            .HasMany(e => e.Therapists)
            .WitMany(e => e.Therapis);
            */
            

            /*
            modelBuilder.Entity<Therapy>()
                .HasMany(e => e.Therapists)
                .WithMany(e => e.Therapis)
                .UsingEntity<TherapistTherapy>(
                    l => l.HasOne<Therapist>(e => e.Therapist).WithMany(e => e.TherapistTherapys).HasForeignKey(x => x.TherapistId),
                    r => r.HasOne<Therapy>(e => e.Therapy).WithMany(e => e.TherapistTherapys).HasForeignKey(x => x.TherapyId));
                */

            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            if(Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
            {
                foreach (var entityType in modelBuilder.Model.GetEntityTypes())
                {
                    var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));
                    
                    foreach (var property in properties)
                    {
                        modelBuilder.Entity(entityType.Name).Property(property.Name)
                        .HasConversion<double>();
                    }
                    
                }
            }
        }
    }
}