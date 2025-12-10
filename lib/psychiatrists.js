export const psychiatrists = [
  {
    id: 'psy-001',
    name: 'Dr. Sarah Johnson',
    title: 'MD, Psychiatrist',
    specialization: ['Depression', 'Anxiety Disorders', 'PTSD'],
    experience: '15 years',
    rating: 4.9,
    reviews: 128,
    consultationFee: 200,
    nextAvailable: 'Tomorrow, 10:00 AM',
    languages: ['English', 'Spanish'],
    education: [
      'MD - Harvard Medical School',
      'Residency - Massachusetts General Hospital'
    ],
    approach: 'Cognitive Behavioral Therapy, Medication Management',
    bio: 'Specializing in depression and anxiety disorders with a holistic approach combining therapy and medication when appropriate.',
    availability: {
      monday: ['10:00-13:00', '14:00-17:00'],
      tuesday: ['9:00-12:00', '14:00-17:00'],
      wednesday: ['10:00-13:00'],
      thursday: ['9:00-12:00', '14:00-17:00'],
      friday: ['10:00-13:00'],
      saturday: [],
      sunday: []
    },
    image: '👩‍⚕️',
    isOnline: true,
    acceptsInsurance: true,
    minSessionDuration: 45
  },
  {
    id: 'psy-002',
    name: 'Dr. Michael Chen',
    title: 'PhD, Clinical Psychologist',
    specialization: ['OCD', 'Panic Disorders', 'Stress Management'],
    experience: '12 years',
    rating: 4.8,
    reviews: 94,
    consultationFee: 180,
    nextAvailable: 'Today, 3:00 PM',
    languages: ['English', 'Mandarin'],
    education: [
      'PhD Clinical Psychology - Stanford University',
      'Postdoc - Johns Hopkins Hospital'
    ],
    approach: 'Exposure Therapy, Mindfulness-Based CBT',
    bio: 'Expert in OCD and anxiety disorders with extensive research background in exposure therapy techniques.',
    availability: {
      monday: ['14:00-18:00'],
      tuesday: ['10:00-13:00', '15:00-18:00'],
      wednesday: ['14:00-18:00'],
      thursday: ['10:00-13:00', '15:00-18:00'],
      friday: ['14:00-17:00'],
      saturday: ['9:00-12:00'],
      sunday: []
    },
    image: '👨‍⚕️',
    isOnline: true,
    acceptsInsurance: false,
    minSessionDuration: 50
  },
  {
    id: 'psy-003',
    name: 'Dr. Priya Sharma',
    title: 'MD, Child & Adolescent Psychiatrist',
    specialization: ['ADHD', 'Autism Spectrum', 'Childhood Depression'],
    experience: '18 years',
    rating: 4.9,
    reviews: 156,
    consultationFee: 220,
    nextAvailable: 'Monday, 11:00 AM',
    languages: ['English', 'Hindi', 'Gujarati'],
    education: [
      'MD Psychiatry - AIIMS Delhi',
      'Fellowship - Boston Children\'s Hospital'
    ],
    approach: 'Play Therapy, Family Therapy, Behavioral Interventions',
    bio: 'Dedicated to child and adolescent mental health with expertise in neurodevelopmental disorders.',
    availability: {
      monday: ['9:00-12:00'],
      tuesday: ['14:00-17:00'],
      wednesday: ['9:00-12:00'],
      thursday: ['14:00-17:00'],
      friday: ['9:00-12:00'],
      saturday: ['10:00-13:00'],
      sunday: []
    },
    image: '👩‍⚕️',
    isOnline: false,
    acceptsInsurance: true,
    minSessionDuration: 60
  },
  {
    id: 'psy-004',
    name: 'Dr. Robert Wilson',
    title: 'MD, Addiction Psychiatrist',
    specialization: ['Substance Abuse', 'Dual Diagnosis', 'Relapse Prevention'],
    experience: '20 years',
    rating: 4.7,
    reviews: 87,
    consultationFee: 250,
    nextAvailable: 'Wednesday, 2:00 PM',
    languages: ['English'],
    education: [
      'MD - UCLA School of Medicine',
      'Addiction Psychiatry Fellowship - Mayo Clinic'
    ],
    approach: 'Motivational Interviewing, Harm Reduction, MAT',
    bio: 'Specializes in addiction psychiatry with comprehensive treatment plans for substance use disorders.',
    availability: {
      monday: ['13:00-17:00'],
      tuesday: ['9:00-12:00'],
      wednesday: ['13:00-17:00'],
      thursday: ['9:00-12:00'],
      friday: ['13:00-16:00'],
      saturday: [],
      sunday: []
    },
    image: '👨‍⚕️',
    isOnline: true,
    acceptsInsurance: true,
    minSessionDuration: 50
  },
  {
    id: 'psy-005',
    name: 'Dr. Elena Rodriguez',
    title: 'PsyD, Trauma Specialist',
    specialization: ['PTSD', 'Trauma Recovery', 'EMDR Therapy'],
    experience: '14 years',
    rating: 4.9,
    reviews: 112,
    consultationFee: 190,
    nextAvailable: 'Friday, 10:30 AM',
    languages: ['English', 'Spanish', 'French'],
    education: [
      'PsyD - University of Denver',
      'EMDR Certification - EMDR Institute'
    ],
    approach: 'EMDR, Trauma-Focused CBT, Somatic Experiencing',
    bio: 'Expert in trauma recovery using evidence-based approaches including EMDR and trauma-focused therapies.',
    availability: {
      monday: ['10:00-14:00'],
      tuesday: ['13:00-17:00'],
      wednesday: ['10:00-14:00'],
      thursday: ['13:00-17:00'],
      friday: ['10:00-13:00'],
      saturday: [],
      sunday: []
    },
    image: '👩‍⚕️',
    isOnline: true,
    acceptsInsurance: false,
    minSessionDuration: 55
  },
  {
    id: 'psy-006',
    name: 'Dr. James Miller',
    title: 'MD, Geriatric Psychiatrist',
    specialization: ['Dementia', 'Late-life Depression', 'Memory Disorders'],
    experience: '22 years',
    rating: 4.8,
    reviews: 76,
    consultationFee: 210,
    nextAvailable: 'Thursday, 9:00 AM',
    languages: ['English', 'German'],
    education: [
      'MD - University of Michigan',
      'Geriatric Psychiatry Fellowship - Duke University'
    ],
    approach: 'Neurocognitive Assessment, Family Counseling, Medication Management',
    bio: 'Specializes in mental health care for older adults with expertise in dementia and memory disorders.',
    availability: {
      monday: ['9:00-12:00'],
      tuesday: ['14:00-17:00'],
      wednesday: ['9:00-12:00'],
      thursday: ['14:00-17:00'],
      friday: ['9:00-12:00'],
      saturday: [],
      sunday: []
    },
    image: '👨‍⚕️',
    isOnline: false,
    acceptsInsurance: true,
    minSessionDuration: 60
  }
];

export const specializations = [
  'Depression',
  'Anxiety Disorders',
  'PTSD',
  'OCD',
  'ADHD',
  'Autism Spectrum',
  'Substance Abuse',
  'Trauma Recovery',
  'Dementia',
  'Bipolar Disorder',
  'Eating Disorders',
  'Relationship Issues',
  'Stress Management',
  'Sleep Disorders',
  'Child & Adolescent'
];

export const insuranceProviders = [
  'Blue Cross Blue Shield',
  'Aetna',
  'UnitedHealthcare',
  'Cigna',
  'Medicare',
  'Medicaid',
  'Kaiser Permanente',
  'Humana'
];