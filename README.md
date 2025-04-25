# Kevel Search Playground

A web application for testing phrase matching in the Kevel Ad Decision API. This tool allows you to test search functionality using either the demo network or your own account settings.

## Features

- Real-time search with phrase matching support
- Configurable settings for network, site, and ad types
- Responsive design with modern UI
- Code snippet generation for API calls
- Settings persistence using localStorage

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kevel-search.git
cd kevel-search
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Usage

1. Enter a search term in the input field
2. Toggle phrase matching if desired
3. Click the search button or press Enter
4. View the results and generated API code snippet

### Settings

Click the settings button to configure:
- Network ID
- Site ID
- Ad Types
- Multi-winner count
- Creative Template Field Name
- Image Field Name
- User Key

## API Documentation

The application uses the Kevel Ad Decision API. For more information about the API and its capabilities, visit the [AdQuery knowledge base page](https://dev.kevel.com/docs/adquery#phrase-or-fuzzy-matching).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Kevel](https://www.kevel.com/) for providing the Ad Decision API
- [Highlight.js](https://highlightjs.org/) for code syntax highlighting
- [Font Awesome](https://fontawesome.com/) for icons 