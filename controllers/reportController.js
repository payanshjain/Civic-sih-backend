    const Report = require('../models/Report');

    // @desc    Create a new report
    // @route   POST /api/reports
    // @access  Private
    exports.createReport = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const report = await Report.create(req.body);

        res.status(201).json({
        success: true,
        data: report
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
    };

    // @desc    Get all reports
    // @route   GET /api/reports
    // @access  Private
    exports.getReports = async (req, res, next) => {
    try {
        const reports = await Report.find().populate('user', 'email');
        res.status(200).json({
        success: true,
        count: reports.length,
        data: reports
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
    };

    // @desc    Get reports for the logged-in user
    // @route   GET /api/reports/my-reports
    // @access  Private
    exports.getUserReports = async (req, res, next) => {
    try {
        const reports = await Report.find({ user: req.user.id });

        if (!reports) {
        return res.status(404).json({ success: false, message: 'No reports found for this user' });
        }

        res.status(200).json({
        success: true,
        count: reports.length,
        data: reports
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
    };

    // @desc    Get a single report
    // @route   GET /api/reports/:id
    // @access  Private
    exports.getReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
        }
        res.status(200).json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
    };

    // @desc    Update report status
    // @route   PUT /api/reports/:id
    // @access  Private (Admin only)
    exports.updateReportStatus = async (req, res, next) => {
    try {
        let report = await Report.findById(req.params.id);

        if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
        }

        report = await Report.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
        });

        res.status(200).json({ success: true, data: report });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
    };

    // @desc    Delete a report
    // @route   DELETE /api/reports/:id
    // @access  Private (Admin only)
    exports.deleteReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
        }

        await report.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
    };

exports.getReportStats = async (req, res, next) => {
  try {
    const totalIssues = Report.countDocuments();
    const pending = Report.countDocuments({ status: 'pending' });
    const inProgress = Report.countDocuments({ status: 'in-progress' });
    const resolved = Report.countDocuments({ status: 'resolved' });

    const [total, pendingCount, inProgressCount, resolvedCount] = await Promise.all([
      totalIssues,
      pending,
      inProgress,
      resolved
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalIssues: total,
        pending: pendingCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};