export const demoCases = [
  {
    id: 'young-adult',
    label: 'Young adult',
    patient: 'Maya R.',
    age: '24',
    context: 'New diagnosis, first long-term medication',
    accent: 'New medication',
    clinicalNote: `Encounter: Primary care follow-up
Patient: Maya R., 24F
Reason for visit: Elevated blood pressure readings at urgent care and home.

Assessment:
Essential hypertension, new diagnosis. BP today 148/94, repeat 146/92. No chest pain, dyspnea, focal neurologic deficits, or edema. Family history notable for HTN. Discussed lifestyle measures and medication initiation.

Plan:
Initiated lisinopril 10 mg PO daily. Recommend BMP in 2-4 weeks to monitor renal function and potassium. Counsel patient on possible hypotension, dry cough, and rare angioedema. Continue home BP log 3x/week and bring to next visit. Follow up with PCP in 1 month. Return precautions reviewed for facial swelling, trouble breathing, syncope, chest pain, severe headache, or neurologic symptoms.`,
    carePlan: {
      summary:
        'Your blood pressure has stayed higher than expected, so your clinician diagnosed high blood pressure and started a daily medicine to help lower it.',
      changed:
        'You started lisinopril 10 mg once a day. You also need a blood test in 2 to 4 weeks to make sure your kidneys and potassium level are okay on the new medicine.',
      nextSteps: [
        {
          timeframe: 'Starting today',
          action: 'Take lisinopril once each day at about the same time.',
        },
        {
          timeframe: 'This week',
          action: 'Check your blood pressure 3 times a week and write the numbers down.',
        },
        {
          timeframe: '2-4 weeks',
          action: 'Schedule a basic blood test to check kidney function and potassium.',
        },
        {
          timeframe: '1 month',
          action: 'Bring your blood pressure log to your primary care follow-up.',
        },
      ],
      warningSigns: [
        'Call your clinic if you feel very dizzy or develop a frequent dry cough.',
        'Get urgent help for swelling of the lips, tongue, or face, trouble breathing, chest pain, fainting, a severe headache, or new weakness/numbness.',
      ],
      questions: [
        'What side effects should make me call right away?',
        'What if I miss one dose?',
        'When should I repeat my blood test?',
        'How will I know if the medicine is working?',
        'What blood pressure number is too high for me?',
        'Can I take this with my current vitamins or pain medicine?',
      ],
      reviewerNote:
        'Keep the explanation focused on dose, lab follow-up, and urgent swelling symptoms. Avoid adding medication advice that is not in the note.',
    },
    followUp: {
      nextVisit: 'Primary care follow-up in 1 month',
      checkIn: {
        medication:
          'I started lisinopril and took it most mornings. I missed 2 doses when my schedule changed.',
        symptoms:
          'I felt lightheaded twice after standing up quickly. I also noticed a dry cough during the last 5 days.',
        measurements:
          'My home blood pressure readings were usually around 135/85. The highest reading I wrote down was 148/92.',
        completedTasks:
          'I kept a blood pressure log and completed the blood test before this visit.',
        topConcern:
          'I want to know if the cough could be from the medicine and what I should do if I miss a dose again.',
      },
      clinicianFocus: [
        'Review blood pressure trend and adherence before adjusting medication.',
        'Ask about dizziness and possible lisinopril-related cough.',
        'Confirm BMP results and whether dose change is needed.',
      ],
    },
  },
  {
    id: 'working-adult',
    label: 'Working adult',
    patient: 'Daniel K.',
    age: '42',
    context: 'Multiple tasks, limited time',
    accent: 'Follow-up priorities',
    clinicalNote: `Encounter: Emergency department discharge
Patient: Daniel K., 42M
Reason for visit: Wheezing and cough after viral URI.

Assessment:
Mild asthma exacerbation, improved after albuterol nebulizer. SpO2 98% RA. CXR without focal infiltrate. No fever in ED. Patient is stable for discharge.

Plan:
Prednisone 40 mg PO daily x 5 days. Albuterol MDI 2 puffs q4-6h PRN wheeze/SOB with spacer. Continue controller inhaler as previously prescribed. PCP follow-up in 7-10 days. Pulmonology referral if symptoms persist or recurrent exacerbations. Return to ED for worsening dyspnea, inability to speak full sentences, blue lips, chest pain, persistent fever, or no relief after rescue inhaler. Recommend smoking cessation counseling and trigger avoidance.`,
    carePlan: {
      summary:
        'You had an asthma flare that improved with breathing treatment. You are stable to go home, but you have several short-term steps to prevent symptoms from getting worse.',
      changed:
        'You were given a 5-day steroid course and instructions for your rescue inhaler. Your controller inhaler should stay the same unless your clinician tells you otherwise.',
      nextSteps: [
        {
          timeframe: 'Next 5 days',
          action: 'Take prednisone 40 mg once daily for the full 5 days.',
        },
        {
          timeframe: 'As needed',
          action: 'Use albuterol 2 puffs every 4 to 6 hours for wheezing or shortness of breath.',
        },
        {
          timeframe: 'This week',
          action: 'Keep using your daily controller inhaler as previously prescribed.',
        },
        {
          timeframe: '7-10 days',
          action: 'Schedule a primary care follow-up to review your asthma plan.',
        },
      ],
      warningSigns: [
        'Go to the emergency department if breathing gets worse, you cannot speak full sentences, your lips turn blue, or you have chest pain.',
        'Call for urgent advice if fever persists or your rescue inhaler does not help.',
      ],
      questions: [
        'Which task is most important for me to do first this week?',
        'When should I use the rescue inhaler versus my controller inhaler?',
        'What should I do if symptoms come back after prednisone?',
        'Do I need a pulmonology referral now or only if this keeps happening?',
        'Can you update my asthma action plan?',
        'What triggers should I focus on avoiding at work or home?',
      ],
      reviewerNote:
        'Emphasize rescue versus controller inhaler language because the raw note contains several medication instructions.',
    },
    followUp: {
      nextVisit: 'Primary care follow-up in 7-10 days',
      checkIn: {
        medication:
          'I finished the 5 days of prednisone. I used albuterol about twice a day for the first 3 days, then less often.',
        symptoms:
          'Breathing improved, but I still cough at night. No blue lips or chest pain.',
        measurements:
          'I do not have a peak flow meter. I tracked inhaler use on my phone.',
        completedTasks:
          'I kept using my daily controller inhaler and avoided smoke as much as possible.',
        topConcern:
          'I want to know if I need a new asthma action plan or a pulmonology visit.',
      },
      clinicianFocus: [
        'Review rescue inhaler use after steroid course.',
        'Clarify controller versus rescue inhaler plan.',
        'Decide whether recurrent symptoms need pulmonology referral.',
      ],
    },
  },
  {
    id: 'senior-caregiver',
    label: 'Senior + caregiver',
    patient: 'Eleanor S.',
    age: '73',
    context: 'Caregiver support and plain-language monitoring',
    accent: 'Caregiver-ready',
    clinicalNote: `Encounter: Hospital discharge summary
Patient: Eleanor S., 73F
Reason for admission: Acute decompensated heart failure with lower extremity edema and dyspnea.

Hospital course:
Diuresed with IV furosemide with symptomatic improvement. Weight decreased from 168 lb to 161 lb. Creatinine stable at discharge. Potassium repleted. Patient ambulating with walker. Daughter assists with medications.

Discharge plan:
Increase furosemide to 40 mg PO qAM. Continue metoprolol succinate and losartan. Low sodium diet <2g/day. Daily weights every morning; call cardiology for weight gain >2 lb in 24h or >5 lb in a week. BMP in 1 week. Cardiology follow-up in 7 days. Home health nursing ordered. Return precautions: severe SOB at rest, chest pain, confusion, syncope, O2 sat <90%, rapidly worsening edema, or inability to urinate.`,
    carePlan: {
      summary:
        'You were treated for a heart failure flare that caused swelling and shortness of breath. Your breathing and swelling improved before discharge.',
      changed:
        'Your water pill, furosemide, was increased to 40 mg every morning. You also need daily weights, a blood test in 1 week, and cardiology follow-up in 7 days.',
      nextSteps: [
        {
          timeframe: 'Every morning',
          action: 'Take furosemide 40 mg and weigh yourself after using the bathroom.',
        },
        {
          timeframe: 'Each day',
          action: 'Keep salt low and write down your weight for your caregiver and cardiology team.',
        },
        {
          timeframe: '1 week',
          action: 'Complete the blood test and attend the cardiology follow-up.',
        },
        {
          timeframe: 'Caregiver note',
          action: 'Home health nursing was ordered. Ask when the first visit will happen.',
        },
      ],
      warningSigns: [
        'Call cardiology if weight goes up more than 2 pounds in 24 hours or more than 5 pounds in a week.',
        'Get urgent help for severe shortness of breath at rest, chest pain, confusion, fainting, oxygen below 90%, rapidly worsening swelling, or inability to urinate.',
      ],
      questions: [
        'Can you explain this plan in plain words for my caregiver?',
        'Which symptom means emergency versus call the clinic?',
        'Can we simplify the medication schedule?',
        'What exact weight number should make us call?',
        'Who do we call if home health does not contact us?',
        'Should we change fluids or salt if swelling returns?',
      ],
      reviewerNote:
        'Use larger chunks and caregiver language. The most important action is daily weight monitoring with clear call thresholds.',
    },
    followUp: {
      nextVisit: 'Cardiology follow-up in 7 days',
      checkIn: {
        medication:
          'My daughter helped me take furosemide every morning. No missed doses that we know of.',
        symptoms:
          'Swelling is better than at discharge, but I still get short of breath walking to the mailbox.',
        measurements:
          'My weight was 161 lb at discharge, then 162, 162, 163, 163, 164, and 164 lb this morning.',
        completedTasks:
          'The blood test was done yesterday. Home health called and scheduled the first nursing visit.',
        topConcern:
          'My daughter wants to know what weight change means emergency versus call cardiology.',
      },
      clinicianFocus: [
        'Review daily weight trend and whether diuretic plan is adequate.',
        'Confirm BMP results after increased furosemide dose.',
        'Clarify call thresholds for patient and caregiver.',
      ],
    },
  },
];

export function generateCareSteps(caseId) {
  return demoCases.find((item) => item.id === caseId)?.carePlan;
}
