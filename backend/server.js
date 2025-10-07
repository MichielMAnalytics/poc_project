const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const dataPath = path.join(__dirname, 'data', 'campaigns.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataPath)) {
  const initialData = {
    campaigns: [
      {
        id: 'welcome_popup',
        component: 'Popup',
        trigger: {
          type: 'screen_enter',
          screen: 'Home'
        },
        props: {
          title: 'Welcome! 🎉',
          message: 'This popup was injected dynamically by the SDK!',
          primaryButton: 'Got it!',
          secondaryButton: 'Remind me later'
        },
        active: true
      }
    ]
  };
  fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
}

// Helper: Read campaigns from file
const readCampaigns = () => {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

// Helper: Write campaigns to file
const writeCampaigns = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// GET all campaigns
app.get('/api/campaigns', (req, res) => {
  try {
    const data = readCampaigns();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read campaigns' });
  }
});

// GET single campaign
app.get('/api/campaigns/:id', (req, res) => {
  try {
    const data = readCampaigns();
    const campaign = data.campaigns.find(c => c.id === req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read campaign' });
  }
});

// POST new campaign
app.post('/api/campaigns', (req, res) => {
  try {
    const data = readCampaigns();
    const newCampaign = req.body;

    // Check if ID already exists
    if (data.campaigns.find(c => c.id === newCampaign.id)) {
      return res.status(400).json({ error: 'Campaign ID already exists' });
    }

    data.campaigns.push(newCampaign);
    writeCampaigns(data);
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// PUT update campaign
app.put('/api/campaigns/:id', (req, res) => {
  try {
    const data = readCampaigns();
    const index = data.campaigns.findIndex(c => c.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    data.campaigns[index] = { ...data.campaigns[index], ...req.body };
    writeCampaigns(data);
    res.json(data.campaigns[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// DELETE campaign
app.delete('/api/campaigns/:id', (req, res) => {
  try {
    const data = readCampaigns();
    const index = data.campaigns.findIndex(c => c.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    data.campaigns.splice(index, 1);
    writeCampaigns(data);
    res.json({ message: 'Campaign deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`);
});
