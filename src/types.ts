export interface Notification {
  id: string;
  referrer: string;
  referrerType: 'colleague' | 'employer' | 'ministry' | 'acc' | 'patient' | 'other';
  doctorName: string;
  registrationNumber: string;
  incidentDate: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'conduct' | 'competence' | 'health' | 'other';
  urgency: boolean;
  status: 'new' | 'awaiting_response' | 'under_review' | 'decided';
  createdAt: string;
}

export interface DoctorResponse {
  notificationId: string;
  response: string;
  receivedAt: string;
  documents?: string[];
}

export type NTTOutcome = 
  | 'no_action'
  | 'education'
  | 'refer_council'
  | 'refer_pcc'
  | 'temporary_limitations';

export type CouncilOutcome = 
  | 'no_action'
  | 'education'
  | 'recertification'
  | 'refer_pac'
  | 'refer_pcc'
  | 'practice_restrictions'
  | 'suspension';

export interface TriageDecision {
  notificationId: string;
  outcome: NTTOutcome;
  reasoning: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  decidedBy: 'ai' | 'human' | 'consensus';
  decidedAt: string;
  aiRecommendation?: {
    outcome: NTTOutcome;
    reasoning: string;
    confidence: number;
  };
}

export interface AIAnalysis {
  riskAssessment: {
    publicSafetyRisk: number;
    reputationalRisk: number;
    recurenceRisk: number;
    overallRisk: number;
  };
  keyFactors: string[];
  similarCases: string[];
  recommendedOutcome: NTTOutcome;
  confidence: number;
  reasoningChain: string[];
}