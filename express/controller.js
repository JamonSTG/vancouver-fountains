const { fountainQueries, reportQueries } = require('./model');

// Fountain Controllers
const fountainController = {
  // Get all fountains with optional filtering
  getAll: (req, res) => {
    try {
      const filters = {
        inpark: req.query.inpark,
        status: req.query.status,
        note: req.query.note,
        search: req.query.search
      };

      const fountains = fountainQueries.getAll(filters);
      
      res.json({
        success: true,
        count: fountains.length,
        data: fountains
      });
    } catch (error) {
      console.error('Error fetching fountains:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve fountains'
      });
    }
  },

  // Get single fountain by ID
  getById: (req, res) => {
    try {
      const fountain = fountainQueries.getById(req.params.id);
      
      if (!fountain) {
        return res.status(404).json({
          error: 'Not found',
          message: `Fountain with ID ${req.params.id} not found`
        });
      }

      // Get reports for this fountain
      const reports = reportQueries.getByFountainId(req.params.id);
      
      console.log('Sending fountain with all data:', fountain);
      
      res.json({
        success: true,
        data: {
          ...fountain,
          reports: reports
        }
      });
    } catch (error) {
      console.error('Error fetching fountain:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve fountain'
      });
    }
  },

  // Update fountain - FIXED VERSION
  update: (req, res) => {
    try {
      // Check if fountain exists
      const fountain = fountainQueries.getById(req.params.id);
      
      if (!fountain) {
        return res.status(404).json({
          error: 'Not found',
          message: `Fountain with ID ${req.params.id} not found`
        });
      }

      console.log('Existing fountain before update:', fountain);
      console.log('Updates to apply:', req.body);

      // Prepare updates object (only include fields that were sent)
      const updates = {};
      
      if (req.body.status !== undefined) updates.status = req.body.status;
      if (req.body.accessible !== undefined) updates.accessible = req.body.accessible;
      if (req.body.note !== undefined) updates.note = req.body.note;
      if (req.body.name !== undefined) updates.name = req.body.name;
      if (req.body.location !== undefined) updates.location = req.body.location;

      // Update the fountain
      const result = fountainQueries.update(req.params.id, updates);

      if (result.changes === 0) {
        return res.status(404).json({
          error: 'Not found',
          message: `Fountain with ID ${req.params.id} not found`
        });
      }

      // Get COMPLETE updated fountain data
      const updatedFountain = fountainQueries.getById(req.params.id);
      
      console.log('Updated fountain after update:', updatedFountain);
      
      res.json({
        success: true,
        message: 'Fountain updated successfully',
        data: updatedFountain
      });
    } catch (error) {
      console.error('Error updating fountain:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update fountain'
      });
    }
  }
};

// Report Controllers
const reportController = {
  // Create a new report for a fountain
  create: (req, res) => {
    try {
      // Check if fountain exists
      const fountain = fountainQueries.getById(req.params.id);
      
      if (!fountain) {
        return res.status(404).json({
          error: 'Not found',
          message: `Fountain with ID ${req.params.id} not found`
        });
      }

      // Create the report
      const reportData = {
        fountain_id: req.params.id,
        issue_type: req.body.issue_type,
        description: req.body.description || null,
        reporter_email: req.body.reporter_email || null
      };

      const reportId = reportQueries.create(reportData);
      const newReport = reportQueries.getById(reportId);

      // If issue is critical, automatically update fountain status
      if (req.body.issue_type === 'not_working') {
        fountainQueries.update(req.params.id, { status: 'out_of_service' });
      } else if (req.body.issue_type === 'needs_maintenance') {
        fountainQueries.update(req.params.id, { status: 'needs_maintenance' });
      }
      
      res.status(201).json({
        success: true,
        message: 'Report submitted successfully',
        data: newReport
      });
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to create report'
      });
    }
  },

  // Get all reports for a fountain
  getByFountainId: (req, res) => {
    try {
      // Check if fountain exists
      const fountain = fountainQueries.getById(req.params.id);
      
      if (!fountain) {
        return res.status(404).json({
          error: 'Not found',
          message: `Fountain with ID ${req.params.id} not found`
        });
      }

      const reports = reportQueries.getByFountainId(req.params.id);
      
      res.json({
        success: true,
        count: reports.length,
        data: reports
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve reports'
      });
    }
  }
};

module.exports = {
  fountainController,
  reportController
};