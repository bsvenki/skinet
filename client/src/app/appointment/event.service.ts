import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap} from 'rxjs/operators';
import {HttpClient,HttpParams,HttpResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IAppointment } from '../shared/models/appointment';
import { Patient } from '../shared/models/patient';
import { BookingType } from '../shared/models/bookingType';
import { TherapyCategory } from '../shared/models/therapycategory';
import { Therapy } from '../shared/models/therapy';
import { Therapist } from '../shared/models/therapist';
import { TherapistTherapy } from '../shared/models/therapistTherapy';
import { AppointmentParams } from '../shared/models/appointmentParams';
import { Doctor } from '../shared/models/doctor';




@Injectable({
  providedIn: 'root'
})
export class EventService {
 

  private eventsSubject = new BehaviorSubject<any[]>([]);

  /*
  private eventsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([
    { title: 'Initial Event', start: '2024-12-25', end: '2024-12-25' },
  ]);
  */
  
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {

    /*
    this.eventsSubject.next([
      {
        id: 5,
        title: 'Chirstmas Event',
        start: '2024-12-25',
        end: '2024-12-25'
      }
    ]);
    */
  }

  // Mock event data for demonstration
  getEvents(): Observable<any[]> {

    return this.http.get<Event[]>(this.baseUrl + 'appointment'); 
    
    /*
    
    const events = [
      {
        title: 'Event 1',
        start: '2024-12-25T10:00:00',
        end: '2024-12-25T11:00:00',
        description: 'Christmas event'
      },
      {
        title: 'Event 2',
        start: '2024-12-26T10:00:00',
        end: '2024-12-26T11:00:00',
        description: 'Holiday event'
      }
    ];
    */
    

    //return of(events); // Simulating an observable data stream
  }

  addEvent(event: any): void {
    // Get current events and add the new event
    const currentEvents = this.eventsSubject.value;
    // Update the BehaviorSubject with the new list of events
    this.eventsSubject.next([...currentEvents, event]);

    /*
    // Get current events and add the new event
    const currentEvents = this.eventsSubject.value;
    const updatedEvents = [...currentEvents, newEvent];
    
    // Update the BehaviorSubject with the new list of events
    this.eventsSubject.next(updatedEvents);
  
    */
  }

  // Method to update events
  updateEvents(updatedEvent: any): void {
    alert('updateEvents');
     // Get the current list of events
    // this.eventsSubject.next(events);

     // Get the current list of events
     const currentEvents = this.eventsSubject.value;

    // Find and update the specific event
    const index = currentEvents.findIndex(event1 => event1.id === updatedEvent.id);
    if (index !== -1) {
      currentEvents[index] = updatedEvent; // Replace the old event with the updated one
    }

    // Update the BehaviorSubject with the new list of events
    this.eventsSubject.next([...currentEvents]);
  }


  // Remove an event and trigger update
  deleteEvent(eventId: number): void {
    const currentEvents = this.eventsSubject.value;
    const updatedEvents = currentEvents.filter(event1 => event1.id !== eventId);
    
    // Update the BehaviorSubject with the new list of events
    this.eventsSubject.next(updatedEvents);
  }
 

  // Observable for subscribers
  getEvents2(): Observable<any[]> {   
    //return this.http.get<any[]>(this.baseUrl + 'Appointment');
    return this.eventsSubject.asObservable();
  }

  // Fetch events from the API and update the BehaviorSubject
  fetchEvents(appointParams: AppointmentParams): void {

     let params = new HttpParams();
    
   
    params = params.append('PatientId',appointParams.patientId);
    params = params.append('BookingTypeId',appointParams.bookingTypeId);
    params = params.append('TherapyCategoryId',appointParams.therapyCategoryId);
    params = params.append('TherapistTherapyId',appointParams.therapistTherapyId); 
    params = params.append('DoctorId',appointParams.doctorId);
    params = params.append('Status',appointParams.status);

    
    this.http.get<any[]>(this.baseUrl + 'appointment',{params}).pipe(
      tap((events) => {
 
        
        events.forEach(event => {
          // Assuming the event date is in UTC or another time zone
          //event.start = this.convertToIST(event.start);
          //event.end = this.convertToIST(event.end);

          // extended property fullcalendar
          if(event.patientId == 2)
          {
            event.color = '#c30010';
            event.status = 'Confirmed';   
          }
          else
          {
            event.color = '0077B6'; 
            event.status = 'free';   
          }
          event.editable = false;
                       
          extendedProps: {
            customColor: 'green'
          }; 
         
          
        });
        
        
        // Update the BehaviorSubject with the fetched events
        this.eventsSubject.next(events);
      }),
      catchError((error) => {
        console.error('Error fetching events:', error);
        // Optionally, you could update the BehaviorSubject with an empty array or some default value in case of an error
        this.eventsSubject.next([]);
        throw error;
      })
    ).subscribe();  // Subscribe to trigger the request
  }

  convertToIST(date: any) {
    // Convert the date to IST (UTC +5:30)
    return new Date(date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  }

  getPatients(){      
      return this.http.get<Patient[]>(this.baseUrl + 'appointment/patients');
  }

  getBookingTypes(){      
    return this.http.get<BookingType[]>(this.baseUrl + 'appointment/bookingtypes');
  }

  getTherapyCategories(){      
    return this.http.get<TherapyCategory[]>(this.baseUrl + 'appointment/therapycategories');
  }

  getTherapysByCategoryId(id: number){      
    return this.http.get<Therapy[]>(this.baseUrl + 'appointment/therapysbycategory/' + id);
  }

  getTherapists(){      
    return this.http.get<Therapist[]>(this.baseUrl + 'appointment/therapists');
  }

  getDoctors(){      
    return this.http.get<Doctor[]>(this.baseUrl + 'appointment/doctors');
  }

  /*

  getTherapistsByTherapyId(therapyid: number){
    return this.http.get<TherapistTherapy[]>(this.baseUrl + 'appointment/therapistsbytherapy?TherapyId=' + therapyid);
  }
  */

  getTherapistsByTherapyId(therapyid: number): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'appointment/therapistsbytherapy?therapyId=' + therapyid);
  }

  getAppointments(){        
    return this.http.get<IAppointment[]>(this.baseUrl + 'Appointment');        
  }


   
}