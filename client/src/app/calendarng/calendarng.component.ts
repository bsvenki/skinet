import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  imports: [FormsModule, CommonModule],
  templateUrl: './calendarng.component.html',
  styleUrls: ['./calendarng.component.scss']
})
export class CalendarComponent {
  currentDate: Date = new Date();
  events: { date: string, eventName: string }[] = [];

  // Get the first day of the current month
  getFirstDayOfMonth(): number {
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    return firstDay.getDay();
  }

  // Get number of days in the current month
  getNumberOfDaysInMonth(): number {
    return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
  }

  // Get the days for the current month (with empty slots for the previous month)
  getCalendarDays() {
    const firstDayOfMonth = this.getFirstDayOfMonth();
    const numberOfDaysInMonth = this.getNumberOfDaysInMonth();
    const calendarDays = [];

    // Create empty slots for previous month's days
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push('');
    }

    // Add the current month's days
    for (let i = 1; i <= numberOfDaysInMonth; i++) {
      calendarDays.push(i);
    }

    return calendarDays;
  }

  // Add a new event to a specific day
  addEvent(day: any) {
    const eventName = prompt('Enter event name:');
    if (eventName) {
      this.events.push({
        date: `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${day}`,
        eventName
      });
    }
  }

  // Edit an existing event
  editEvent(day: any, oldEventName: string) {
    const newEventName = prompt('Edit event name:', oldEventName);
    if (newEventName !== null) {
      const eventIndex = this.events.findIndex(event => event.date === `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${day}` && event.eventName === oldEventName);
      if (eventIndex !== -1) {
        this.events[eventIndex].eventName = newEventName;
      }
    }
  }

  // Delete an event
  deleteEvent(day: any, eventName: string) {
    const eventIndex = this.events.findIndex(event => event.date === `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${day}` && event.eventName === eventName);
    if (eventIndex !== -1) {
      this.events.splice(eventIndex, 1);
    }
  }

  // Get events for a specific day
  getEventsForDay(day: any) {
    return this.events.filter(event => event.date === `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${day}`);
  }

  // Navigate to previous month
  // Date not changing, usse switchToPrevMonth
  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
  }

  // Navigate to next month
  // Date not changing, uss switchToNextMonth
  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
  }

  switchToNextMonth() {
    this.incrementMonth(1);
  }

  switchToPrevMonth() {
    this.incrementMonth(-1);
  }

  private incrementMonth(delta: number): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + delta,
      this.currentDate.getDate());
  }

  
}