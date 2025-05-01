# Kevel Search Playground

A simple web application for testing and visualizing search functionality with Kevel's API.

## Features

- Real-time search visualization
- Phrase match toggle
- Customizable search parameters
- Responsive design
- Local storage for settings

## Requirements

- PHP 7.4 or higher
- Web server (Apache/Nginx)
- Modern web browser

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kevel-search-playground.git
cd kevel-search-playground
```

2. Configure your web server:
   - For Apache, ensure mod_rewrite is enabled
   - Point your web server to the project directory
   - Make sure the .htaccess file is being read

3. Access the application through your web server:
```
http://your-domain.com/kevel-search-playground/
```

## Development

To run locally:
```bash
php -S localhost:8000
```

Then open http://localhost:8000 in your browser.

## Configuration

The application uses a PHP proxy (proxy.php) to handle API requests. No additional configuration is needed.

## File Structure

```
kevel-search-playground/
├── css/
│   └── styles.css
├── img/
│   ├── favicon.png
│   ├── Kevel-Ad-Server-dark.png
│   ├── placeholder.svg
│   └── search_icon.svg
├── js/
│   └── main.js
├── .htaccess
├── index.html
├── proxy.php
└── README.md
```

## License

MIT License

## Acknowledgments

- [Kevel](https://www.kevel.com/) for providing the Ad Decision API
- [Highlight.js](https://highlightjs.org/) for code syntax highlighting
- [Font Awesome](https://fontawesome.com/) for icons 
