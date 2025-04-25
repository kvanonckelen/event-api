const express = require('express');
const router = express.Router();
const {Event} = require('./models'); // Adjust the import based on your project structure
const authMiddleware = require('./authMiddleware');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({ order: [['timestamp', 'DESC']] });
    res.json(events);

  } catch (err) {
    console.error('❌ Error fetching events:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
      const event = await Event.findByPk(req.params.id);
  
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(event, null, 2));
    } catch (err) {
      console.error('❌ Error fetching event:', err);
      res.status(500).json({ error: 'Server error while fetching event' });
    }
  });
module.exports = router;
