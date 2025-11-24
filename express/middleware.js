// Validation middleware functions

// Validate fountain ID parameter
const validateFountainId = (req, res, next) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id) || id < 1) {
    return res.status(400).json({
      error: 'Invalid fountain ID',
      message: 'Fountain ID must be a positive integer'
    });
  }
  
  req.params.id = id;
  next();
};

// Validate report creation data
const validateReportData = (req, res, next) => {
  const { issue_type, description } = req.body;
  
  const errors = [];
  
  if (!issue_type || typeof issue_type !== 'string' || issue_type.trim().length === 0) {
    errors.push('issue_type is required and must be a non-empty string');
  }
  
  const validIssueTypes = ['not_working', 'needs_maintenance', 'vandalized', 'low_pressure', 'other'];
  if (issue_type && !validIssueTypes.includes(issue_type)) {
    errors.push(`issue_type must be one of: ${validIssueTypes.join(', ')}`);
  }
  
  if (description && typeof description !== 'string') {
    errors.push('description must be a string');
  }
  
  if (description && description.length > 500) {
    errors.push('description must not exceed 500 characters');
  }
  
  if (req.body.reporter_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.reporter_email)) {
      errors.push('reporter_email must be a valid email address');
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      messages: errors
    });
  }
  
  next();
};

// Validate fountain update data
const validateFountainUpdate = (req, res, next) => {
  const { status, accessible, note, name, location } = req.body;
  
  const errors = [];
  
  // Check if at least one field is provided
  if (!status && accessible === undefined && !note && !name && !location) {
    errors.push('At least one field must be provided for update');
  }
  
  // Validate status
  if (status) {
    const validStatuses = ['working', 'needs_maintenance', 'out_of_service'];
    if (!validStatuses.includes(status)) {
      errors.push(`status must be one of: ${validStatuses.join(', ')}`);
    }
  }
  
  // Validate accessible
  if (accessible !== undefined) {
    if (typeof accessible !== 'boolean' && accessible !== 0 && accessible !== 1) {
      errors.push('accessible must be a boolean or 0/1');
    }
  }
  
  // Validate note
  if (note !== undefined) {
    if (typeof note !== 'string') {
      errors.push('note must be a string');
    } else if (note.length > 200) {
      errors.push('note must not exceed 200 characters');
    }
  }
  
  // Validate name
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      errors.push('name must be a non-empty string');
    } else if (name.length > 200) {
      errors.push('name must not exceed 200 characters');
    }
  }
  
  // Validate location
  if (location !== undefined) {
    if (typeof location !== 'string' || location.trim().length === 0) {
      errors.push('location must be a non-empty string');
    } else if (location.length > 300) {
      errors.push('location must not exceed 300 characters');
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      messages: errors
    });
  }
  
  next();
};

// Validate query parameters for GET requests
const validateQueryParams = (req, res, next) => {
  const { inpark, status, note, search } = req.query;
  
  const errors = [];
  
  if (inpark && inpark !== 'Y' && inpark !== 'N') {
    errors.push('inpark parameter must be "Y" or "N"');
  }
  
  if (status) {
    const validStatuses = ['working', 'needs_maintenance', 'out_of_service'];
    if (!validStatuses.includes(status)) {
      errors.push(`status parameter must be one of: ${validStatuses.join(', ')}`);
    }
  }
  
  if (note && typeof note !== 'string') {
    errors.push('note parameter must be a string');
  }
  
  if (search && typeof search !== 'string') {
    errors.push('search parameter must be a string');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Invalid query parameters',
      messages: errors
    });
  }
  
  next();
};

module.exports = {
  validateFountainId,
  validateReportData,
  validateFountainUpdate,
  validateQueryParams
};
