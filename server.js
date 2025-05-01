const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const compression = require('compression');
const app = express();

// Get port from environment variable or use default
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/kevel-search-playground' : '';

// Middleware
app.use(compression()); // Add compression
app.use(cors());
app.use(express.json());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(basePath, express.static(path.join(__dirname, '.'), {
  maxAge: isProduction ? '1d' : 0 // Cache for 1 day in production
}));

// Log all requests only in development
if (!isProduction) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// API endpoint to proxy Adzerk requests
app.post(`${basePath}/api/search`, async (req, res) => {
  if (!isProduction) {
    console.log('Received search request:', req.body);
  }
  
  const { query, phraseMatch, networkId, siteId, adTypes, count, fieldName, imageField, userKey } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const adzerkRequestBody = {
      ...(userKey && { user: { key: userKey } }),
      enableBotFiltering: true,
      consent: { gdpr: true },
      placements: [{
        divName: 'results',
        networkId: networkId,
        siteId: siteId,
        adTypes: adTypes.split(',').map(type => parseInt(type.trim())),
        count: parseInt(count),
        adQuery: { [`ct${fieldName}`]: { eq: query, phraseMatch } }
      }]
    };

    if (!isProduction) {
      console.log('Sending request to Adzerk with body:', JSON.stringify(adzerkRequestBody, null, 2));
    }
    
    const response = await fetch(`https://e-${networkId}.adzerk.net/api/v2`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(adzerkRequestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (!isProduction) {
        console.error('Adzerk API error:', errorText);
      }
      return res.status(response.status).json({ error: 'Adzerk API error', details: errorText });
    }

    const data = await response.json();
    if (!isProduction) {
      console.log('Successfully received response from Adzerk API');
    }
    res.json(data);
  } catch (error) {
    if (!isProduction) {
      console.error('Error proxying request to Adzerk:', error);
    }
    res.status(500).json({ error: 'Failed to fetch results', details: error.message });
  }
});

// Handle OPTIONS requests for CORS
app.options(`${basePath}/api/search`, cors());

// Serve index.html for all other routes
app.get(`${basePath}*`, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port} with base path ${basePath || '/'}`);
}); 