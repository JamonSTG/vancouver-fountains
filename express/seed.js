const { fountainQueries } = require('./model');
const fs = require('fs');
const path = require('path');

// Read the fountains data from JSON file
const dataPath = path.join(__dirname, '../fountains-data.json');
const fountainsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('Seeding database with fountain data...');

// RESET existing data so we re-seed full fountain objects
const fountainsFile = path.join(__dirname, './data/fountains.json');
const reportsFile = path.join(__dirname, './data/reports.json');
fs.writeFileSync(fountainsFile, JSON.stringify([], null, 2));
fs.writeFileSync(reportsFile, JSON.stringify([], null, 2));

let successCount = 0;
let errorCount = 0;

fountainsData.forEach((fountain) => {
  try {
    fountainQueries.create({
      mapid: fountain.mapid,
      name: fountain.name,
      location: fountain.location,
      inpark: fountain.inpark,
      latitude: fountain.latitude,
      longitude: fountain.longitude,
      maintainer: fountain.maintainer,
      note: fountain.note,
      status: 'working',
      accessible: 1
    });

    successCount++;
    console.log(`✓ Added: ${fountain.name || fountain.mapid}`);
  } catch (error) {
    errorCount++;
    console.error(`✗ Error adding ${fountain.name || fountain.mapid}:`, error.message);
  }
});

console.log('\n--- Seeding Complete ---');
console.log(`Successfully added: ${successCount} fountains`);
console.log(`Errors: ${errorCount}`);
console.log(`Total fountains in database: ${fountainQueries.getAll().length}`);
