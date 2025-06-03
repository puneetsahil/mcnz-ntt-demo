import { Notification, AIAnalysis, NTTOutcome, TriageDecision } from '../types';

export class AITriageService {
  static analyzeNotification(notification: Notification): AIAnalysis {
    const riskFactors = this.assessRiskFactors(notification);
    const riskAssessment = this.calculateRiskScores(notification, riskFactors);
    const recommendedOutcome = this.determineRecommendedOutcome(riskAssessment, riskFactors);
    const confidence = this.calculateConfidence(notification, riskFactors);
    
    return {
      riskAssessment,
      keyFactors: riskFactors,
      similarCases: this.findSimilarCases(notification),
      recommendedOutcome,
      confidence,
      reasoningChain: this.generateReasoningChain(notification, riskAssessment, riskFactors)
    };
  }

  private static assessRiskFactors(notification: Notification): string[] {
    const factors: string[] = [];

    if (notification.urgency) {
      factors.push('Marked as urgent by referrer');
    }

    if (notification.severity === 'critical') {
      factors.push('Critical severity level reported');
    } else if (notification.severity === 'high') {
      factors.push('High severity incident');
    }

    if (notification.category === 'conduct') {
      factors.push('Professional conduct concern');
    } else if (notification.category === 'competence') {
      factors.push('Clinical competence concern');
    }

    if (notification.referrerType === 'employer') {
      factors.push('Employer-initiated referral (institutional concern)');
    } else if (notification.referrerType === 'ministry') {
      factors.push('Ministry of Health referral (regulatory concern)');
    } else if (notification.referrerType === 'patient') {
      factors.push('Patient complaint (direct impact)');
    }

    const descriptionLower = notification.description.toLowerCase();
    if (descriptionLower.includes('patient harm') || descriptionLower.includes('patient safety')) {
      factors.push('Patient safety implications identified');
    }
    if (descriptionLower.includes('repeated') || descriptionLower.includes('pattern')) {
      factors.push('Pattern of behavior suggested');
    }
    if (descriptionLower.includes('intoxicated') || descriptionLower.includes('substance')) {
      factors.push('Substance use concern');
    }
    if (descriptionLower.includes('unprofessional') || descriptionLower.includes('inappropriate')) {
      factors.push('Unprofessional behavior reported');
    }
    if (descriptionLower.includes('competency') || descriptionLower.includes('skill')) {
      factors.push('Clinical competency questioned');
    }

    return factors;
  }

  private static calculateRiskScores(notification: Notification, factors: string[]): AIAnalysis['riskAssessment'] {
    let publicSafetyRisk = 0.3;
    let reputationalRisk = 0.2;
    let recurenceRisk = 0.2;

    if (notification.urgency) publicSafetyRisk += 0.4;
    if (notification.severity === 'critical') publicSafetyRisk += 0.3;
    if (notification.severity === 'high') publicSafetyRisk += 0.2;

    if (factors.includes('Patient safety implications identified')) publicSafetyRisk += 0.2;
    if (factors.includes('Pattern of behavior suggested')) {
      recurenceRisk += 0.4;
      publicSafetyRisk += 0.1;
    }
    if (factors.includes('Substance use concern')) {
      publicSafetyRisk += 0.3;
      recurenceRisk += 0.2;
    }

    if (notification.referrerType === 'ministry') reputationalRisk += 0.3;
    if (notification.referrerType === 'employer') reputationalRisk += 0.2;
    if (factors.includes('Unprofessional behavior reported')) reputationalRisk += 0.2;

    publicSafetyRisk = Math.min(1, publicSafetyRisk);
    reputationalRisk = Math.min(1, reputationalRisk);
    recurenceRisk = Math.min(1, recurenceRisk);

    const overallRisk = (publicSafetyRisk * 0.5) + (reputationalRisk * 0.3) + (recurenceRisk * 0.2);

    return {
      publicSafetyRisk: Math.round(publicSafetyRisk * 100) / 100,
      reputationalRisk: Math.round(reputationalRisk * 100) / 100,
      recurenceRisk: Math.round(recurenceRisk * 100) / 100,
      overallRisk: Math.round(overallRisk * 100) / 100
    };
  }

  private static determineRecommendedOutcome(riskAssessment: AIAnalysis['riskAssessment'], factors: string[]): NTTOutcome {
    const { overallRisk, publicSafetyRisk } = riskAssessment;

    if (publicSafetyRisk >= 0.8 || factors.includes('Marked as urgent by referrer')) {
      return 'temporary_limitations';
    }
    
    if (overallRisk >= 0.7 || publicSafetyRisk >= 0.6) {
      return 'refer_pcc';
    }
    
    if (overallRisk >= 0.5 || factors.includes('Pattern of behavior suggested')) {
      return 'refer_council';
    }
    
    if (overallRisk >= 0.3) {
      return 'education';
    }
    
    return 'no_action';
  }

  private static calculateConfidence(notification: Notification, factors: string[]): number {
    let confidence = 0.6;

    if (notification.description.length > 200) confidence += 0.1;
    if (factors.length >= 3) confidence += 0.1;
    if (notification.referrerType === 'employer' || notification.referrerType === 'ministry') confidence += 0.1;
    if (notification.severity === 'critical' || notification.severity === 'high') confidence += 0.1;

    return Math.min(0.95, Math.round(confidence * 100) / 100);
  }

  private static findSimilarCases(notification: Notification): string[] {
    const cases = [
      'Case #2023-045: Similar conduct concern with colleague referral',
      'Case #2023-122: Competence issue with comparable severity',
      'Case #2024-008: Patient safety concern with similar outcome'
    ];
    
    return cases.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private static generateReasoningChain(
    notification: Notification, 
    riskAssessment: AIAnalysis['riskAssessment'], 
    factors: string[]
  ): string[] {
    const reasoning = [
      `Initial assessment: ${notification.category} concern with ${notification.severity} severity`
    ];

    if (factors.length > 0) {
      reasoning.push(`Key risk factors identified: ${factors.slice(0, 3).join(', ')}`);
    }

    reasoning.push(
      `Risk analysis: Public safety (${Math.round(riskAssessment.publicSafetyRisk * 100)}%), ` +
      `Reputational (${Math.round(riskAssessment.reputationalRisk * 100)}%), ` +
      `Recurrence (${Math.round(riskAssessment.recurenceRisk * 100)}%)`
    );

    const outcome = this.determineRecommendedOutcome(riskAssessment, factors);
    const outcomeDescriptions = {
      'no_action': 'No further action required based on low risk assessment',
      'education': 'Educational intervention recommended for moderate risk',
      'refer_council': 'Council referral needed due to elevated risk factors',
      'refer_pcc': 'PCC referral required for serious conduct concerns',
      'temporary_limitations': 'Immediate practice limitations due to public safety risk'
    };

    reasoning.push(`Recommendation: ${outcomeDescriptions[outcome]}`);

    return reasoning;
  }

  static generateTriageDecision(notification: Notification): TriageDecision {
    const analysis = this.analyzeNotification(notification);
    
    return {
      notificationId: notification.id,
      outcome: analysis.recommendedOutcome,
      reasoning: analysis.reasoningChain.join('. '),
      confidence: analysis.confidence,
      riskLevel: this.mapOverallRiskToLevel(analysis.riskAssessment.overallRisk),
      recommendations: this.generateRecommendations(analysis),
      decidedBy: 'ai',
      decidedAt: new Date().toISOString()
    };
  }

  private static mapOverallRiskToLevel(overallRisk: number): 'low' | 'medium' | 'high' | 'critical' {
    if (overallRisk >= 0.8) return 'critical';
    if (overallRisk >= 0.6) return 'high';
    if (overallRisk >= 0.4) return 'medium';
    return 'low';
  }

  private static generateRecommendations(analysis: AIAnalysis): string[] {
    const recommendations = [];
    
    if (analysis.riskAssessment.publicSafetyRisk > 0.6) {
      recommendations.push('Consider immediate practice monitoring');
    }
    
    if (analysis.keyFactors.includes('Pattern of behavior suggested')) {
      recommendations.push('Review previous notifications for this practitioner');
    }
    
    if (analysis.confidence < 0.8) {
      recommendations.push('Request additional information before final decision');
    }
    
    recommendations.push('Ensure doctor response is obtained per natural justice principles');
    
    return recommendations;
  }
}