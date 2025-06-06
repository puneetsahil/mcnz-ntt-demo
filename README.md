# Medical Council Notifications Triage Team System

An AI-driven application for Medical Council Notifications Triage Teams to assist in processing fitness to practice notifications.

## Features

- **Notification Submission**: Comprehensive form for submitting notifications with all relevant details
- **AI-Assisted Risk Assessment**: Automated analysis of notifications using risk factors
- **Natural Justice Compliance**: Built-in workflow ensuring doctor response requirements
- **Decision Support**: AI recommendations with transparent reasoning chains
- **Human-in-the-Loop**: Final decisions remain with human reviewers
- **Audit Trail**: Complete record of decisions and reasoning

## Demo Workflow

1. **Submit Notification**: Enter details about the incident or concern
2. **Doctor Response**: System shows placeholder for natural justice requirement
3. **AI Analysis**: Automated risk assessment and outcome recommendation
4. **Human Review**: NTT member reviews AI analysis and makes final decision
5. **Decision Recording**: Complete audit trail maintained

## AI Risk Assessment

The system evaluates:
- **Public Safety Risk**: Immediate danger to patients or public
- **Reputational Risk**: Impact on profession and council reputation  
- **Recurrence Risk**: Likelihood of repeated incidents
- **Pattern Analysis**: Detection of concerning behavioral patterns

## Possible Outcomes

- **No Action Required**: Low risk, minor issues
- **Educational Guidance**: Moderate risk, learning opportunity
- **Council Referral**: Elevated risk requiring full council review
- **PCC Referral**: Serious conduct concerns
- **Practice Limitations**: Immediate public safety concerns

## Getting Started

```bash
npm install
npm start
```

The application will open at http://localhost:3000

## Technology Stack

- React 18 with TypeScript
- CSS-in-JS styling
- Responsive design
- Client-side state management

## Note

This is a demonstration application showcasing how AI can assist healthcare regulation. It does not connect to real systems and uses simulated data for demo purposes.

## Access

The application requires authentication:
- Username: `optimation`
- Password: `0pt1mat10n`