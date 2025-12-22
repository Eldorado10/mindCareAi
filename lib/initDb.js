/**
 * Database initialization script
 * Run with: node lib/initDb.js
 * 
 * This script:
 * 1. Tests database connection
 * 2. Syncs all models with the database
 * 3. Seeds sample data (optional)
 */

import 'dotenv/config.js';
import { getDatabase } from './database.js';
import getPsychiatrist from './models/Psychiatrist.js';
import getResource from './models/Resource.js';
import getBooking from './models/Booking.js';
import getUser from './models/User.js';
import getMoodEntry from './models/MoodEntry.js';
import getHealthData from './models/HealthData.js';
import getRisk from './models/Risk.js';
import bcrypt from 'bcryptjs';

async function initializeDatabase() {
  try {
    console.log('🔌 Testing database connection...');
    const sequelize = getDatabase();
    
    if (!sequelize) {
      throw new Error('Failed to initialize database');
    }
    
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');

    console.log('📊 Syncing models with database...');
    await sequelize.sync({ force: true });
    console.log('✅ Models synced successfully!');

    // Get model instances
    const Psychiatrist = getPsychiatrist();
    const Resource = getResource();
    const Booking = getBooking();
    const User = getUser();
    const MoodEntry = getMoodEntry();
    const HealthData = getHealthData();
    const Risk = getRisk();

    // Optional: Seed sample data
    const psychiatristCount = await Psychiatrist.count();
    if (psychiatristCount === 0) {
      console.log('📝 Seeding sample psychiatrists...');
      await Psychiatrist.bulkCreate([
        {
          name: 'Dr. Sarah Johnson',
          specialization: 'Anxiety Disorders',
          experience: 10,
          rating: 4.8,
          consultationFee: 150.00,
          bio: 'Specializes in treating anxiety and panic disorders with evidence-based techniques.',
          
        },
        {
          name: 'Dr. Michael Chen',
          specialization: 'Depression & Mood',
          experience: 12,
          rating: 4.9,
          consultationFee: 160.00,
          bio: 'Expert in cognitive behavioral therapy for depression and bipolar disorders.',
          
        },
        {
          name: 'Dr. Emma Williams',
          specialization: 'PTSD & Trauma',
          experience: 8,
          rating: 4.7,
          consultationFee: 140.00,
          bio: 'Specialized trauma therapist using EMDR and exposure therapy.',
         
        },
      ]);
      console.log('✅ Sample psychiatrists created!');
    }

    const resourceCount = await Resource.count();
    if (resourceCount === 0) {
      console.log('📝 Seeding sample resources...');
      await Resource.bulkCreate([
        {
          title: 'Anxiety Management',
          description: 'Guided exercises and techniques to manage anxiety',
          category: 'Coping Skills',
          icon: '🧘',
          color: 'blue',
          features: JSON.stringify(['Breathing Exercises', 'Grounding Techniques', 'Anxiety Journal']),
        },
        {
          title: 'Depression Support',
          description: 'Tools and resources for depression management',
          category: 'Mental Health',
          icon: '🌞',
          color: 'purple',
          features: JSON.stringify(['Mood Tracking', 'Activity Scheduling', 'Positive Psychology']),
        },
        {
          title: 'Sleep Hygiene',
          description: 'Improve sleep quality with evidence-based methods',
          category: 'Wellness',
          icon: '😴',
          color: 'green',
          features: JSON.stringify(['Sleep Schedule', 'Relaxation Techniques', 'Sleep Diary']),
        },
      ]);
      console.log('✅ Sample resources created!');
    }

    // Seed sample users with different roles
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('📝 Seeding sample users...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await User.bulkCreate([
        {
          firstName: 'John',
          lastName: 'Patient',
          email: 'patient@example.com',
          password: hashedPassword,
          role: 'patient',
          phone: '+1 (555) 123-4567',
          isActive: true,
        },
        {
          firstName: 'Dr. Sarah',
          lastName: 'Researcher',
          email: 'researcher@example.com',
          password: hashedPassword,
          role: 'researcher',
          phone: '+1 (555) 234-5678',
          specialization: 'Psychology & Neuroscience',
          isActive: true,
        },
        {
          firstName: 'Alex',
          lastName: 'DataScientist',
          email: 'datascientist@example.com',
          password: hashedPassword,
          role: 'data-scientist',
          phone: '+1 (555) 345-6789',
          specialization: 'Mental Health Analytics',
          isActive: true,
        },
        {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'admin',
          phone: '+1 (555) 456-7890',
          isActive: true,
        },
      ]);
      console.log('✅ Sample users created!');
      console.log('📧 Demo credentials:');
      console.log('   Patient: patient@example.com / password123');
      console.log('   Researcher: researcher@example.com / password123');
      console.log('   Data Scientist: datascientist@example.com / password123');
      console.log('   Admin: admin@example.com / password123');
    }

    // Seed sample mood entries if user exists
    const moodCount = await MoodEntry.count();
    if (moodCount === 0) {
      console.log('📝 Seeding sample mood entries...');
      const user = await User.findOne({ where: { email: 'patient@example.com' } });
      if (user) {
        const moods = ['terrible', 'bad', 'poor', 'okay', 'good', 'great', 'excellent'];
        const moodLevels = [2, 3, 4, 5, 6, 8, 9];
        
        for (let i = 0; i < 10; i++) {
          const moodIndex = Math.floor(Math.random() * moods.length);
          const dateOffset = Math.floor(Math.random() * 30);
          const date = new Date();
          date.setDate(date.getDate() - dateOffset);
          
          await MoodEntry.create({
            userId: user.id,
            moodLevel: moodLevels[moodIndex],
            moodLabel: moods[moodIndex],
            problem: moodIndex < 4 ? `Feeling ${moods[moodIndex]} today` : null,
            improvement: moodIndex >= 5 ? `Improved mood and energy levels` : null,
            notes: `Daily mood tracking entry`,
            date,
          });
        }
      }
      console.log('✅ Sample mood entries created!');
    }

    // Seed sample health data
    const healthCount = await HealthData.count();
    if (healthCount === 0) {
      console.log('📝 Seeding sample health data...');
      const user = await User.findOne({ where: { email: 'patient@example.com' } });
      if (user) {
        await HealthData.bulkCreate([
          {
            userId: user.id,
            condition: 'Anxiety Disorder',
            severity: 'moderate',
            description: 'Generalized anxiety with occasional panic attacks',
            treatmentStartDate: new Date('2024-01-15'),
            status: 'active',
          },
          {
            userId: user.id,
            condition: 'Sleep Issues',
            severity: 'mild',
            description: 'Occasional insomnia and irregular sleep patterns',
            treatmentStartDate: new Date('2024-02-01'),
            status: 'active',
          },
        ]);
      }
      console.log('✅ Sample health data created!');
    }

    console.log('\n✨ Database initialization complete!');
    console.log('📍 Your database is ready to use.');
    console.log('🚀 Start your app with: npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

initializeDatabase();