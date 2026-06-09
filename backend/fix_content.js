require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Learning = require('./models/Learning');

const imagesToDownload = [
  {
    name: 'drip.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Drip_Irrigation.jpg/800px-Drip_Irrigation.jpg',
    title: 'Modern Drip Irrigation Techniques',
    contentUrl: 'https://www.youtube.com/watch?v=33K8L5u1hN8'
  },
  {
    name: 'ipm.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Pest_management.jpg/800px-Pest_management.jpg',
    title: 'Integrated Pest Management (IPM) Basics',
    contentUrl: 'https://www.epa.gov/safepestcontrol/integrated-pest-management-ipm-principles'
  },
  {
    name: 'drone.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Agricultural_drone.jpg/800px-Agricultural_drone.jpg',
    title: 'Using Drones for Crop Surveillance',
    contentUrl: 'https://www.youtube.com/watch?v=9oZ_fO09r7k'
  },
  {
    name: 'soil.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Soil_profile.jpg/800px-Soil_profile.jpg',
    title: 'Soil Health and Fertilizer Optimization',
    contentUrl: 'https://www.nrcs.usda.gov/wps/portal/nrcs/main/national/soils/health/'
  },
  {
    name: 'organic.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Harvesting_organic_vegetables.jpg/800px-Harvesting_organic_vegetables.jpg',
    title: 'Organic Farming: A Beginner\'s Guide',
    contentUrl: 'https://www.youtube.com/watch?v=1z3aO24Q79Y'
  }
];

const downloadImage = async (url, filepath) => {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    let error = null;
    writer.on('error', err => {
      error = err;
      writer.close();
      reject(err);
    });
    writer.on('close', () => {
      if (!error) resolve(true);
    });
  });
};

const fixContent = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const imagesDir = path.join(__dirname, '../frontend/public/images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    for (const item of imagesToDownload) {
      console.log(`Downloading ${item.name}...`);
      const filepath = path.join(imagesDir, item.name);
      await downloadImage(item.url, filepath);
      
      console.log(`Updating DB for ${item.title}...`);
      await Learning.updateOne(
        { title: item.title },
        { $set: { 
            contentUrl: item.contentUrl,
            thumbnailUrl: `/images/${item.name}`
        }}
      );
    }

    console.log('✅ Success! Real images downloaded and proper video links updated.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixContent();
