require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Learning = require('../models/Learning');

const resources = [
  {
    title: 'Modern Drip Irrigation Techniques',
    description: 'Learn how to set up and maintain a drip irrigation system to save water and improve crop yield in arid regions.',
    category: 'Modern Farming',
    type: 'Video',
    contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Dummy link
    thumbnailUrl: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Integrated Pest Management (IPM) Basics',
    description: 'A comprehensive guide to identifying and controlling agricultural pests using environmentally friendly methods.',
    category: 'Pest Control',
    type: 'Article',
    contentUrl: 'https://www.fao.org/pest-and-pesticide-management/ipm/en/', // Real link
    thumbnailUrl: 'https://images.unsplash.com/photo-1628189871790-272cb250a266?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Using Drones for Crop Surveillance',
    description: 'An overview of agricultural drone technology for monitoring crop health, spraying fertilizers, and mapping land.',
    category: 'Technology',
    type: 'Video',
    contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Dummy link
    thumbnailUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Soil Health and Fertilizer Optimization',
    description: 'Techniques for soil testing and selecting the right fertilizers to maximize crop production without degrading the soil.',
    category: 'Crop Management',
    type: 'Article',
    contentUrl: 'https://soilhealthinstitute.org/', // Real link
    thumbnailUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Organic Farming: A Beginner\'s Guide',
    description: 'Step-by-step introduction to transitioning from conventional to organic farming, including certification processes.',
    category: 'Modern Farming',
    type: 'Video',
    contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Dummy link
    thumbnailUrl: 'https://images.unsplash.com/photo-1592982537447-6f29e1d88ee3?q=80&w=600&auto=format&fit=crop'
  }
];

const seedLearning = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://anandvishal999999_db_user:MYLwqhmE7GoirDzV@cluster0.qj9s1rg.mongodb.net/kisansaathi';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected...');
    
    await Learning.deleteMany();
    console.log('Existing learning resources removed.');
    
    await Learning.insertMany(resources);
    console.log('Learning resources seeded successfully!');
    
    process.exit();
  } catch (err) {
    console.error('Error with data import:', err);
    process.exit(1);
  }
};

seedLearning();
