import { Component, signal, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { formatDate } from '@fullcalendar/core';
import { IAppointment } from 'src/app/shared/models/appointment';
import { I } from '@fullcalendar/core/internal-common';

import {HttpClient,HttpResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AppointmentService } from '../appointment/appointment.service';
import { EventService } from '../appointment/event.service';
import { createEventId } from '../appointment/event.utils';
import { FormsModule } from '@angular/forms';
import flatpickr from 'flatpickr';  // Import Flatpickr



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './patient.component.html',  
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent {
 
 

  constructor(private changeDetector: ChangeDetectorRef, public appointmentService: AppointmentService, private eventService: EventService,private http: HttpClient) { }


  baseUrl = environment.apiUrl;
  appointments: IAppointment[] = [];


  //events: EventInput[] = [];  // Store events here
  selectedEvent: EventInput | null = null;  // Track the selected event
  eventTitle: string = '';  // Title of the event
  eventStartDate: string = '';  // Start date of the event
  eventEndDate: string = '';  // End date of the event
  isModalOpen: boolean = false;  // Flag to open/close the modal
  cqlApi: any;

  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    firstDay: 1, // Start the week on Monday
    initialDate: new Date(),  // Set to current date
    headerToolbar: {
      left: 'prev,next today',      
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'timeGridWeek',
    //initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    droppable: false,
    allDaySlot: false,  // Hide the "All Day" slot section
    datesSet(arg) {
      arg.start = new Date();
    },
    

    //eventColor: 'lightcoral',        // Default background color for all events
    //eventTextColor: 'darkred',       // Default text color for all events
    //defaultTimedEventDuration: 15,
   
    //timeZone: 'Asia/Kolkata', // Set the time zone to IST (Asia/Kolkata)

    // Configure time slots with 15 minutes interval
    slotDuration: '00:15:00',       // Time slot duration is 15 minutes
    slotLabelInterval: '00:15:00',  // Time slot label interval is 15 minutes
    //minTime: '06:00:00',          // Set the minimum time (optional, for example, 6 AM)
    //maxTime: '22:00:00',          // Set the maximum time (optional, for example, 10 PM)
    validRange: {
      start: new Date().toISOString().split('T')[0]  // Start from today (YYYY-MM-DD)
    },

    businessHours: {
      // Business hours configuration
      //daysOfWeek: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '12:00' }, // Morning session
      //daysOfWeek: [1, 2, 3, 4, 5], startTime: '13:00', endTime: '17:00' }, // Afternoon session
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7], // Monday to Friday (0=Sunday, 1=Monday, etc.)
      startTime: '09:00', // Start time of business hours
      endTime: '17:00', // End time of business hours
      // Optionally, you can define different hours for specific days
      // For example:
      // [0]: { startTime: '10:00', endTime: '15:00' } // for Sunday
      // Block out lunch hour (12:00 PM to 1:00 PM) manually by adjusting start and end times
      // We set two time slots: one from 9 AM to 12 PM, and another from 1 PM to 5 PM
      segments: [
        {
          startTime: '09:00', // Morning session
          endTime: '12:00'
        },
        {
          startTime: '13:00', // Afternoon session (after lunch)
          endTime: '17:00'
        }
      ]
    },
    
    
    slotMinTime: '09:00:00',  // Set the minimum visible time (9:00 AM)
    slotMaxTime: '17:00:00',  // Set the maximum visible time (5:00 PM)

    //events: "https://localhost:5001/api/Appointment", //this is working

    //events: this.appointmentService.getAppointmentsNew, //this is working, but not showing in calendar

    //events: this.getAppointmentsLocalOne(),    
   
    

    
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    
    

    //select: this.handleDateSelect.bind(this),   
    eventsSet: this.handleEvents.bind(this),
  
    // Customize time grid cells (availability) using datesSet
    //datesSet: this.handleDatesSet.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
    //eventAdd: this.handleEventAdd.bind(this),

    // Listen to eventAdd, eventChange, and eventRemove
    eventAdd: (event) => this.onEventAdd(event),
    eventChange: (event) => this.onEventChange(event),
    eventRemove: (event) => this.onEventRemove(event),

    
    
  

    
    
  });
  
  currentEvents = signal<EventApi[]>([]);


    // Example availability data for the doctor
    doctorAvailability = [
      { date: '2024-12-25', available: true },
      { date: '2024-12-26', available: true },
      { date: '2024-12-27', available: true },
      // Add more availability here...
    ];
  



  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }



  // Handle click on an empty date to add a new event
  handleDateClick(arg: any) {

    const currentDate = new Date();
    if (new Date(arg.dateStr) < currentDate) {
        // Restrict editing of past events
        const calendarApi = arg.view.calendar;
        calendarApi.unselect();
        alert('You cannot edit past events!');
       
        
        return false;  // Prevent the event click action
    }

    const eventStart = new Date(arg.dateStr);

    // Check if event is outside business hours
    if (eventStart.getHours() < 9 || eventStart.getHours() >= 17) {
      const calendarApi = arg.view.calendar;
      calendarApi.unselect();
      alert('You cannot edit events outside of business hours.');    
      
      //arg.remove(arg.event);
      return false;  // Prevent editing if outside business hours
    }

    // Check if event is in lunch time
    if (eventStart.getHours() >= 12 && eventStart.getHours() <= 12) {
      const calendarApi = arg.view.calendar;
      calendarApi.unselect();
      alert('You cannot edit events during lunch time.');    
      
      //arg.remove(arg.event);
      return false;  // Prevent editing if outside business hours
    }
    
    
    this.selectedEvent = null;
    this.eventTitle = '';
    this.eventStartDate = arg.dateStr;  // Set clicked date as the start date

    var d = new Date(arg.dateStr);
    var newEndDate = new Date(d.getTime() + 15*60000);
    this.eventEndDate = newEndDate.toString();//arg.dateStr;  // Set the end date to the start date
    this.isModalOpen = true;  // Open the modal to add an event
    return true;
  }

  handleDateSelect(selectInfo: DateSelectArg) {



    
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;
  

    calendarApi.unselect(); // clear date selection

    if (title) {
      const myaddevent: EventInput = {
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      };
      calendarApi.addEvent(myaddevent);

      // At this step will Invoke onEventAdd from eventAdd calendar configuration 
      // to add event in database using REST API

      //alert(myaddevent.start);
      //alert(myaddevent.id);
    }
  }


  // Close the modal window
  closeModal() {
    this.isModalOpen = false;
  }

  // Save or update the event
  saveEvent() {

    //formatDate(arg.event.start, { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' });
   const startDate = new Date(this.eventStartDate);
   const endDate = new Date(this.eventEndDate);
   //const startDate = new Date(this.eventStartDate.toLocaleString());
   //const endDate = new Date(this.eventStartDate.toLocaleString());

    //const startDate = new Date(formatDate(this.eventStartDate, { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' }));
    //const endDate = new Date(formatDate(this.eventEndDate, { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' }));

    if (this.selectedEvent) {
      // Update an existing event
      //this.selectedEvent.title = this.eventTitle;
      //this.selectedEvent.start = startDate;
      //this.selectedEvent.end = endDate;

      
      const myupdateevent: IAppointment = {
        id: this.selectedEvent.id? this.selectedEvent.id.toString() : '0',
        title: this.eventTitle,
        start: new Date(this.eventStartDate),
        end: new Date(this.eventEndDate),        
      };

     
      

      //this.currentEvents.setProp('title', updatedEvent.title);  // Update title in the calendar
      
      this.eventService.updateEvents(myupdateevent);
      this.onEventChange(myupdateevent);
      
      
      //this.currEvent.event.setProp('title', myupdateevent.title); 
      setTimeout(() => {        
        this.ngOnInit();
        //this.prepareRow();
        //this.prepareGroups(); 
      }, 1000);
      
      // this.updateEventInDatabase(this.selectedEvent);
      
    } 
    else 
    {
      const myaddevent: IAppointment = {
        id: createEventId(),
        title: this.eventTitle,
        start: startDate,
        end: endDate,        
      };
      this.eventService.addEvent(myaddevent); 
      this.onEventAdd(myaddevent);
      this.ngOnInit(); 
      
  
      //this.appointments.push(myaddevent);
      
      

      /*
      // Add a new event
      this.events.push({
        title: this.eventTitle,
        start: startDate,
        end: endDate,
        allDay: false
      });
      */
      
    }

    this.closeModal();  // Close the modal
  }

  // Delete the selected event
  deleteEvent2(event: any) {
    this.appointments = this.appointments.filter(existingEvent => existingEvent !== event);
  }


  /*
  // This method is called whenever the calendar is updated (datesSet or view change)
  handleDatesSet(info: any): void {
    const allCells = document.querySelectorAll('.fc-day');
    

    allCells.forEach(cell => {
      const date = cell.getAttribute('data-date');  // Get the date in 'YYYY-MM-DD' format
      const parsedDate = new Date(date);  // Ensure it's a valid Date object
  
      if (!isNaN(parsedDate.getTime())) {
        const cellTime = parsedDate.getHours();
        // Proceed with your logic
        if (cellTime >= 9 && cellTime < 17) {
          cell.style.backgroundColor = '#b7f5b7';  // Light green for availability
        } else {
          cell.style.backgroundColor = '';  // Default color
        }
      }
    });
  }
  */

  handleEventClick(arg: any) {
    alert('handleEventClick');

    const currentDate = new Date();
    if (new Date(arg.event.start) < currentDate) {
        // Restrict editing of past events
        const calendarApi = arg.view.calendar;
        calendarApi.unselect();
        alert('You cannot edit past events!');     
        
        return false;  // Prevent the event click action
    };

    // Validation for existing booking
    if (arg.event.extendedProps.status === 'confirmed') {
      alert('This slot is already booked and cannot be edited.');
      return false;  // Prevent editing of booked events
    }
    //alert(clickInfo.event.id);
    /*
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
    */

    //arg.event.title = this.eventTitle;
 
    this.cqlApi = arg.view.calendar;
    this.selectedEvent = arg.event;
    this.eventTitle = arg.event.title;
    this.eventStartDate  = arg.event.start;
    this.eventEndDate = arg.event.end;
    //this.eventStartDate = formatDate(arg.event.start, { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' });
    //this.eventEndDate = arg.event.end ? formatDate(arg.event.end, { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' }) : this.eventStartDate;
    this.isModalOpen = true;  // Open the modal to edit the event
    return true;

    /*
    const event1 = arg.event;
    

    

    //const action = prompt('Edit or delete this event?', 'edit/delete');
    const action = prompt(`Would you like to edit or delete the event: "${event1.title}"? Type "edit" or "delete".`);
    if (action === 'edit') {
      const updatedEvent = {
        id: parseInt(event1.id),
        title: prompt('Enter new event title', event1.title),
        //start: event1.start?.toISOString(),
        //end: event1.end?.toISOString(),
        start: '2024-12-24T09:00:00',
        end: '2024-12-24T10:00:00'
        
      };
      if(updatedEvent.title) {
        event1.setProp('title', updatedEvent.title);  // Update title in the calendar

         // At this step will Invoke onEventUpdat from eventUpdate calendar configuration 
         // to udpate event in database using REST API
      }
      // Update event through EventService
      // this.eventService.updateEvents(updatedEvent);
    } else if (action === 'delete') {
      // Delete the event through EventService
      if (confirm(`Are you sure you want to delete the event: "${event1.title}"?`)) 
      {
        event1.remove();  // Remove from calendar

        // At this step will Invoke onEventDelete from eventDelete calendar configuration 
        // to delete event in database using REST API
            
        // var appointmentid = parseInt(event1.id)
        // this.eventService.deleteEvent(appointmentid);
      }
    }
    */
  }

  
  //handleEvents(events: EventApi[]) {
    handleEvents(events: EventApi[]) {


    const allCells = document.querySelectorAll('.fc-day');
    

    
      events.forEach(event => {
        
        const date = event.startStr.split('T')[0];  // Get the date string (YYYY-MM-DD)
        
        // Check if the date matches the doctor's availability
        const availability = this.doctorAvailability.find(item => item.date === date);
        
        // Find the cell for this date in the calendar
        //const cell = document.querySelector(`.fc-day[data-date="${date}"]`);

        

        //const cell = document.querySelector('fc-daygrid-day-events');

       

        //const cell = document.querySelector('.fc-daygrid-event');
      
        const cell = document.querySelector('.fc-day');
        
        // Change cell background color based on availability
        if (cell) {
          cell.classList.add('available');
          cell.classList.add('available');  // Add class for available dates
          if (availability) {
            if (availability.available) {
              cell.classList.add('available');  // Add class for available dates
            } else {
              cell.classList.add('unavailable');  // Add class for unavailable dates
            }
          }
        }
      });
    
    
    


    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
    
    
   
    
    
    //this.currentEvents.style.backgroundColor = '#00ff00';  // Green for Event 2
    // Handle all loaded events (e.g., refresh or load events)
    // To do for any refresh
  }

   // Handle all loaded events (e.g., refresh or load events)
   //handleEvents(events: any[]): void {
   // console.log('Loaded events:', events); // You can log or process events here
  //}

  ngOnInit(){
    //this.getAppointmentsLocal()

    /* this works from event.service.ts use it for testing purpose */
     // Fetch events from the API
     this.eventService.fetchEvents();

     // Subscribe to the events observable and update FullCalendar
    this.eventService.getEvents2().subscribe((events) => {
      this.appointments = events; 

    });

    
    
     
    
  }

  // Example of adding a new event
  addNewEvent() {
    alert('test');
    const newEvent = {
      id: createEventId(),
      title: 'New Event',
      start: '2024-12-28',
      end: '2024-12-28'
    };
    
    
    this.eventService.addEvent(newEvent);  // This will update the event list
    
  }

  // Example method to update an existing event
  updateExistingEvent() {
    const updatedEvent = {
      id: 2,
      title: 'Updated Event from API rendered one',
      start: '2024-12-23T09:00:00',
      end: '2024-12-23T10:00:00',
    };

    this.eventService.updateEvents(updatedEvent);  // This triggers an update in eventsSubject
  }

  // Example method to delete an event
  deleteEvent(eventId: number) {
    this.eventService.deleteEvent(eventId);  // This triggers an update in eventsSubject
  }

  getAppointmentsLocal(){
      
    this.appointmentService.getAppointments().subscribe((resp: IAppointment[]) => {      
      this.appointments = resp.map((e: IAppointment) => ({id: e.id, title: e.title, start: e.start, end: e.end }))      
    })
  }

  /* old working one
  onEventAdd(event : any) {
    alert('oneventadd');
    const eventData = event.event;

    // Send the new event data to your backend for storage in the database
    this.http.post(`${this.baseUrl}/appointment`, {
      title: eventData.title,
      start: eventData.start.toISOString(),
      end: eventData.end?.toISOString(), // Ensure that the end date is optional if not set
      description: eventData.extendedProps?.description || ''
    })
    .subscribe(response => {
      console.log('Event added successfully', response);
    }, error => {
      console.error('Error adding event', error);
    });
  }
  */

  // Handle the event when a new event is added to FullCalendar
  onEventAdd(event: any): void {
    alert('onEventAdd');
    //const eventData = event.event;
    const eventData = event;

    this.addEventToDatabase(eventData).subscribe({
      next: (response) => {
        console.log('Event added successfully', response);
      },
      error: (err) => {
        console.error('Error adding event', err);
      }
    });
  }

  // Handle the event when an existing event is modified
  onEventChange(event: any): void {
   // const eventData = event.event;
   const eventData = event;

   eventData.title = this.eventTitle;

    this.updateEventInDatabase(eventData).subscribe({
      next: (response) => {
        console.log('Event updated successfully', response);
      },
      error: (err) => {
        console.error('Error updating event', err);
      }
    });
  }

  // Handle the event when an existing event is removed
  onEventRemove(event: any): void {
    alert('OnEventRemove')
    const eventData = event.event;

    this.removeEventFromDatabase(eventData.id).subscribe({
      next: (response) => {
        console.log('Event removed successfully', response);
      },
      error: (err) => {
        console.error('Error removing event', err);
      }
    });
  }

  // Method to add an event to the remote database
  addEventToDatabase(eventData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}Appointment`, {
      title: eventData.title,
      start: this.toISOLocal(new Date(eventData.start)),  //eventData.start.toISOString(),
      end: this.toISOLocal(new Date(eventData.end)) //eventData.end?.toISOString(), // Ensure that the end date is optional if not set
      //description: eventData.extendedProps?.description || ''
    }).pipe(
      catchError(error => {
        console.error('Error in addEventToDatabase:', error);
        return of(null); // Return an observable with a fallback value
      })
    );
  }

  // Method to update an event in the remote database
  updateEventInDatabase(eventData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}Appointment/${eventData.id}`, {
      id: eventData.id,
      title: eventData.title,
      //start: eventData.start.toISOString(),
      //end: eventData.end?.toISOString(),
      start: this.toISOLocal(new Date(eventData.start)), 
      end: this.toISOLocal(new Date(eventData.end))
      //description: eventData.extendedProps?.description || ''
    }).pipe(
      catchError(error => {
        console.error('Error in updateEventInDatabase:', error);
        return of(null); // Return an observable with a fallback value
      })
    );
  }

  // Method to remove an event from the remote database
  removeEventFromDatabase(eventId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}Appointment/${eventId}`).pipe(
      catchError(error => {
        console.error('Error in removeEventFromDatabase:', error);
        return of(null); // Return an observable with a fallback value
      })
    );
  }

  

  toISOLocal(d: any) {
    var z  = (n: string | number) =>  ('0' + n).slice(-2);
    var zz = (n: string) => ('00' + n).slice(-3);
    var off = d.getTimezoneOffset();
    var sign = off > 0? '-' : '+';
    off = Math.abs(off);
  
    return d.getFullYear() + '-'
           + z(d.getMonth()+1) + '-' +
           z(d.getDate()) + 'T' +
           z(d.getHours()) + ':'  + 
           z(d.getMinutes()) + ':' +
           z(d.getSeconds()) + '.' +
           zz(d.getMilliseconds()) +
           sign + z(off/60|0) + ':' + z(off%60); 
  }


}


