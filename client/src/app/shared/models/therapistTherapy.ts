import { Therapist } from "./therapist";
import { Therapy } from "./therapy";

export interface TherapistTherapy{
    id: number;
    therapyId: number;
    therapistId: number;  
    therapy: null;  
    therapist: Therapist;
    therapists: Therapist[];  
   
    
}

