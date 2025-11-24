const fs = require('fs');
const path = require('path');

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const FOUNTAINS_FILE = path.join(DATA_DIR, 'fountains.json');
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json');

// Coerce route params or other string IDs to numbers
const toId = (id) => (typeof id === 'string' ? Number(id) : id);

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
if (!fs.existsSync(FOUNTAINS_FILE)) {
  fs.writeFileSync(FOUNTAINS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(REPORTS_FILE)) {
  fs.writeFileSync(REPORTS_FILE, JSON.stringify([], null, 2));
}

// Helper function to read JSON data
function readData(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

// Helper function to write JSON data
function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const fountainQueries = {
  // Get all fountains with optional filters
  getAll: (filters = {}) => {
    let fountains = readData(FOUNTAINS_FILE);

    if (filters.inpark) {
      fountains = fountains.filter(f => f.inpark === filters.inpark);
    }

    if (filters.status) {
      fountains = fountains.filter(f => f.status === filters.status);
    }

    if (filters.note) {
      fountains = fountains.filter(f => f.note && f.note.toLowerCase().includes(filters.note.toLowerCase()));
    }

    return fountains;
  },

  // Get fountain by ID
  getById: (id) => {
    const fountains = readData(FOUNTAINS_FILE);
    const nid = toId(id);
    return fountains.find(f => f.id === nid);
  },

  // Get fountain by map ID
  getByMapId: (mapid) => {
    const fountains = readData(FOUNTAINS_FILE);
    return fountains.find(f => f.mapid === mapid);
  },

  // Create new fountain
  create: (fountain) => {
    const fountains = readData(FOUNTAINS_FILE);

    // Generate new ID
    const maxId = fountains.length > 0
      ? Math.max(...fountains.map(f => f.id))
      : 0;

    const newFountain = {
      id: maxId + 1,
      ...fountain,
      status: fountain.status || 'working',
      accessible: fountain.accessible || 1
    };

    fountains.push(newFountain);
    writeData(FOUNTAINS_FILE, fountains);

    return newFountain.id;
  },

  // Update fountain
  update: (id, updates) => {
    const fountains = readData(FOUNTAINS_FILE);
    const nid = toId(id);
    const index = fountains.findIndex(f => f.id === nid);

    if (index === -1) {
      return { changes: 0 };
    }

    fountains[index] = {
      ...fountains[index],
      ...updates
    };

    writeData(FOUNTAINS_FILE, fountains);

    return { changes: 1 };
  },

  // Delete fountain
  delete: (id) => {
    const fountains = readData(FOUNTAINS_FILE);
    const nid = toId(id);
    const filtered = fountains.filter(f => f.id !== nid);

    if (filtered.length === fountains.length) {
      return { changes: 0 };
    }

    writeData(FOUNTAINS_FILE, filtered);

    return { changes: 1 };
  }
};

const reportQueries = {
  // Get all reports for a fountain
  getByFountainId: (fountainId) => {
    const reports = readData(REPORTS_FILE);
    const fid = toId(fountainId);
    return reports
      .filter(r => toId(r.fountain_id) === fid)
      .sort((a, b) => new Date(b.reported_date) - new Date(a.reported_date));
  },

  // Create new report
  create: (report) => {
    const reports = readData(REPORTS_FILE);

    // Generate new ID
    const maxId = reports.length > 0
      ? Math.max(...reports.map(r => r.id))
      : 0;

    const newReport = {
      id: maxId + 1,
      ...report,
      reported_date: new Date().toISOString()
    };

    reports.push(newReport);
    writeData(REPORTS_FILE, reports);

    return newReport.id;
  },

  // Get report by ID
  getById: (id) => {
    const reports = readData(REPORTS_FILE);
    const nid = toId(id);
    return reports.find(r => r.id === nid);
  }
};

module.exports = {
  fountainQueries,
  reportQueries
};
