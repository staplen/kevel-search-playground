const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from the root directory

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API endpoint to proxy Adzerk requests
app.post('/api/search', async (req, res) => {
  console.log('Received search request:', req.body);
  
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
        adQuery: { [fieldName]: { eq: query, phraseMatch } }
      }]
    };

    console.log('Sending request to Adzerk with body:', JSON.stringify(adzerkRequestBody, null, 2));
    
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
      console.error('Adzerk API error:', errorText);
      return res.status(response.status).json({ error: 'Adzerk API error', details: errorText });
    }

    const data = await response.json();
    console.log('Successfully received response from Adzerk API');
    res.json(data);
  } catch (error) {
    console.error('Error proxying request to Adzerk:', error);
    res.status(500).json({ error: 'Failed to fetch results', details: error.message });
  }
});

// Handle OPTIONS requests for CORS
app.options('/api/search', cors());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 