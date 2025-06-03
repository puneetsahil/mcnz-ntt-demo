import { Notification } from '../types';

export const sampleNotifications: Omit<Notification, 'id' | 'status' | 'createdAt'>[] = [
  {
    referrer: "Dr. Sarah Mitchell",
    referrerType: "colleague",
    doctorName: "Dr. James Wilson",
    registrationNumber: "12345",
    incidentDate: "2024-01-15",
    description: "Dr. Wilson was 15 minutes late to morning rounds and seemed tired during the team meeting. This has happened a couple of times this month. No patient care issues were observed, but wanted to flag as a potential pattern.",
    severity: "low",
    category: "conduct",
    urgency: false
  },
  {
    referrer: "Auckland District Health Board",
    referrerType: "employer",
    doctorName: "Dr. Rebecca Chen",
    registrationNumber: "67890",
    incidentDate: "2024-01-20",
    description: "Dr. Chen made a medication prescribing error that resulted in a patient receiving double the intended dose of warfarin. The error was caught by pharmacy before administration. Dr. Chen acknowledged the mistake and showed understanding of the potential consequences. This appears to be an isolated incident with no pattern of similar errors.",
    severity: "medium",
    category: "competence",
    urgency: false
  },
  {
    referrer: "Ministry of Health",
    referrerType: "ministry",
    doctorName: "Dr. Michael Thompson",
    registrationNumber: "11223",
    incidentDate: "2024-01-18",
    description: "Multiple patients have complained about Dr. Thompson's inappropriate comments during consultations, including making personal remarks about their appearance and lifestyle choices. Three separate incidents reported within the past month. Patients report feeling uncomfortable and one requested a different doctor.",
    severity: "high",
    category: "conduct",
    urgency: false
  },
  {
    referrer: "Emergency Department Nurse Manager",
    referrerType: "colleague",
    doctorName: "Dr. Lisa Anderson",
    registrationNumber: "44556",
    incidentDate: "2024-01-22",
    description: "Dr. Anderson appeared intoxicated during night shift. Strong smell of alcohol, unsteady gait, and slurred speech observed by multiple staff members. Patient safety was immediately at risk. Dr. Anderson was removed from duty and sent home. This is the second similar incident in three months.",
    severity: "critical",
    category: "health",
    urgency: true
  },
  {
    referrer: "Mrs. Janet Smith",
    referrerType: "patient",
    doctorName: "Dr. Robert Davis",
    registrationNumber: "78901",
    incidentDate: "2024-01-25",
    description: "Dr. Davis performed a surgical procedure without obtaining proper informed consent. The patient was not adequately informed about the risks and alternative treatment options. The surgery resulted in complications that required additional procedures. Patient safety was compromised due to inadequate pre-operative assessment and documentation.",
    severity: "high",
    category: "competence",
    urgency: false
  },
  {
    referrer: "Practice Manager",
    referrerType: "employer",
    doctorName: "Dr. Emma Taylor",
    registrationNumber: "33445",
    incidentDate: "2024-01-28",
    description: "Dr. Taylor has been consistently running 45-60 minutes behind schedule, causing significant disruption to the practice. Multiple patient complaints about wait times. Dr. Taylor appears overwhelmed and has mentioned personal stress affecting work performance. No immediate patient safety concerns but quality of care may be compromised.",
    severity: "medium",
    category: "competence",
    urgency: false
  }
];

export const getRandomSample = (): Omit<Notification, 'id' | 'status' | 'createdAt'> => {
  const randomIndex = Math.floor(Math.random() * sampleNotifications.length);
  return sampleNotifications[randomIndex];
};