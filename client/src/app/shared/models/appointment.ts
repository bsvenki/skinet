export interface IAppointment{
    id: string;
    title: string; 
    start: Date;
    end: Date;  
    patientId: number;
    bookingTypeId: number;
    therapyCategoryId: number;  
    //therapyId: number;
    therapistTherapyId: number;
    doctorId: number;
    status: string;

     
  }

  