// Initialize Highlight.js
hljs.highlightAll();

// Verify elements exist
const input = document.getElementById('search-input');
const toggle = document.getElementById('phrase-match');
const codeSnippet = document.getElementById('code-snippet');
const searchForm = document.getElementById('search-form');
const resultsSection = document.getElementById('results-section');
const resultsHeading = document.getElementById('results-heading');
const result = document.getElementById('result');
const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const closeButton = document.querySelector('.close-button');
const settingsForm = document.getElementById('settings-form');

// Verify required elements exist
if (!codeSnippet) {
  console.error('codeSnippet element not found!');
} else {
  console.log('codeSnippet element found:', codeSnippet);
}

// Use global environment variables
const basePath = window.APP_ENV.basePath;

// Prefill from URL
const params = new URLSearchParams(window.location.search);
const initialQuery = params.get('query');
const initialPhrase = params.get('phrase');
if (initialQuery) input.value = initialQuery;
if (initialPhrase === 'true' || initialPhrase === '1') toggle.checked = true;

// Default settings
let settings = {
  networkId: '11754',
  siteId: '1302966',
  adTypes: '320',
  count: '10',
  fieldName: 'title',
  imageField: 'image',
  userKey: ''
};

// Load settings from localStorage if available
loadSettings();

// Load settings from localStorage if available
function loadSettings() {
  const savedSettings = localStorage.getItem('searchSettings');
  if (savedSettings) {
    settings = JSON.parse(savedSettings);
    // Update form inputs with saved settings
    document.getElementById('network-id').value = settings.networkId;
    document.getElementById('site-id').value = settings.siteId;
    document.getElementById('ad-types').value = settings.adTypes;
    document.getElementById('count').value = settings.count;
    document.getElementById('field-name').value = settings.fieldName;
    document.getElementById('image-field').value = settings.imageField;
    document.getElementById('user-key').value = settings.userKey;
  }
}

// Save settings to localStorage
function saveSettings(newSettings) {
  settings = newSettings;
  localStorage.setItem('searchSettings', JSON.stringify(settings));
}

// Handle settings modal
settingsButton.addEventListener('click', () => {
  settingsModal.style.display = 'block';
});

closeButton.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === settingsModal) {
    settingsModal.style.display = 'none';
  }
});

// Handle settings form submission
settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const newSettings = {
    networkId: document.getElementById('network-id').value,
    siteId: document.getElementById('site-id').value,
    adTypes: document.getElementById('ad-types').value,
    count: document.getElementById('count').value,
    fieldName: document.getElementById('field-name').value,
    imageField: document.getElementById('image-field').value,
    userKey: document.getElementById('user-key').value
  };
  saveSettings(newSettings);
  settingsModal.style.display = 'none';
  
  // Update the snippet to reflect the new field name
  updateSnippet();
  
  // If there's a query in the input, trigger a new search
  if (input.value.trim()) {
    runSearch();
  }
});

function updateSnippet() {
  const query = input.value;
  const pm = toggle.checked;
  console.log('Updating snippet with:', { query, pm, fieldName: settings.fieldName });
  const snippet = `adQuery: {ct${settings.fieldName}: {eq: "${query}", phraseMatch: ${pm}}}`;
  console.log('Generated snippet:', snippet);
  codeSnippet.textContent = snippet;
  hljs.highlightElement(codeSnippet);
}

function createCard(item) {
  // Create link wrapper
  const link = document.createElement('a');
  link.href = item.clickUrl;
  link.target = '_blank';
  link.rel = 'noopener';
  link.className = 'card-link';

  const card = document.createElement('div');
  card.className = 'card';
  
  // Create image with error handling
  const img = document.createElement('img');
  img.src = item.contents[0].data[`ct${settings.imageField}`];
  img.alt = item.contents[0].data[`ct${settings.fieldName}`];
  img.onerror = () => {
    img.src = `${basePath}/img/placeholder.svg`;
    img.alt = 'Placeholder image';
  };
  
  const h2 = document.createElement('h2');
  h2.textContent = item.contents[0].data[`ct${settings.fieldName}`];
  
  card.append(img, h2);
  link.appendChild(card);
  return link;
}

async function runSearch() {
  const query = input.value.trim();
  const phraseMatch = toggle.checked;
  
  if (!query) {
    document.getElementById('result').textContent = 'Please enter a search term';
    return;
  }

  try {
    console.log('Sending search request:', { query, phraseMatch, ...settings });
    const response = await fetch(`${basePath}/api/search`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query,
        phraseMatch,
        networkId: settings.networkId,
        siteId: settings.siteId,
        adTypes: settings.adTypes,
        count: settings.count,
        fieldName: settings.fieldName,
        imageField: settings.imageField,
        userKey: settings.userKey
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch results');
    }
    
    const data = await response.json();
    const results = data.decisions?.results || [];
    const resultEl = document.getElementById('result');
    const heading = document.getElementById('results-heading');
    resultEl.innerHTML = '';
    heading.textContent = `Results (${results.length})`;
    
    if (results.length === 0) {
      const msg = document.createElement('div');
      msg.className = 'no-results';
      msg.textContent = 'No results found.';
      resultEl.appendChild(msg);
    } else {
      results.forEach(item => {
        resultEl.appendChild(createCard(item));
      });
    }
  } catch (err) {
    console.error('Search error:', err);
    document.getElementById('result').textContent = 'Error: ' + err.message;
  }
}

// Event listeners
console.log('Setting up event listeners');
input.addEventListener('input', () => {
  console.log('Input changed');
  updateSnippet();
});
toggle.addEventListener('change', () => {
  console.log('Toggle changed');
  updateSnippet();
});
searchForm.addEventListener('submit', e => {
  console.log('Form submitted');
  e.preventDefault();
  runSearch();
});

// Initialize snippet and auto-trigger search if prefetched
console.log('Initializing snippet');
updateSnippet();
if (initialQuery) {
  console.log('Initial query found:', initialQuery);
  runSearch();
}

// Display search results
function displayResults(data) {
  resultsSection.style.display = 'block';
  const results = data.decisions?.results || [];
  
  if (results.length === 0) {
    result.innerHTML = '<p class="no-results">No results found</p>';
    return;
  }

  resultsHeading.textContent = `Results (${results.length})`;
  result.innerHTML = results.map(item => `
    <a href="${item.clickUrl}" class="card-link" target="_blank">
      <div class="card">
        <img src="${item.imageUrl}" alt="${item.title}" onerror="this.src='img/placeholder.svg'">
        <h2>${item.title}</h2>
      </div>
    </a>
  `).join('');
}

// Handle collapsible info box
const infoBox = document.querySelector('.info-box');
const infoBoxHeader = document.querySelector('.info-box-header');
const collapseButton = document.querySelector('.collapse-button');

infoBoxHeader.addEventListener('click', (event) => {
  // Only toggle if the click wasn't on the settings button
  if (!event.target.closest('#settings-button')) {
    infoBox.classList.toggle('collapsed');
  }
}); 