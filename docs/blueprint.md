# **App Name**: Domain Insights

## Core Features:

- Tabbed Navigation: Implement a top navbar with tabs for 'Availability', 'Keywords', 'Backlinks', 'Valuation', 'Generator', and 'Trademarks'. Each tab represents a separate view with its respective route.
- Domain Availability Checker: Text input to enter a domain name and check its availability via a GET request to /api/availability?domain={value}. Display results in a card including status, registrar, creation date, expiry date, nameservers, and notes. Handle loading and error states gracefully.
- Keyword Analysis: Provide a text input for a seed keyword and a locale dropdown (default 'en-US'). Implement a toggle for 'Use Google Ads (requires token)'.
- Data Source Selection: Upon form submission, call POST /api/keywords/google-ads (if Google Ads toggle is on) or GET /api/keywords/trends to obtain keyword data. Render data in a table.
- Keyword Data Display: Display a table with the term, searchVolume, cpc, competition, and source. Show small badges indicating the accuracy or relativity of each data source. If an LLM is used to analyze data quality or insights, it should function as a tool to complement the results.
- Backlink Viewer: Placeholder for future Backlink data.
- Valuation Estimator: Placeholder for future valuation estimator.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) for a professional and trustworthy feel.
- Background color: Very light blue (#F0F2F9) to provide a clean and minimal look.
- Accent color: Purple (#7E57C2) to highlight interactive elements and key information.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look; suitable for headlines or body text.
- Responsive layout to adapt to different screen sizes, ensuring a consistent user experience across devices.
- Use simple, clear icons to represent different sections and actions, enhancing usability.
- Subtle animations and transitions to provide feedback and improve user engagement.