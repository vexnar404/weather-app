High-Performance Weather Dashboard

A lightning-fast, production-ready weather dashboard built to visualize real-time conditions and deeply analyze up to two years of historical climate data.

The goal of this project was to build a highly optimized frontend architecture that handles massive datasets and external API latency without sacrificing user experience.

View the Live Deployment Here (Insert your Vercel link here)

Engineering for Speed (\<500ms Render)
Waiting on external APIs is the biggest bottleneck in frontend performance. I set a strict internal standard for this application: the UI must paint in under 500ms, regardless of network conditions.

To achieve this, I implemented:

1.  Concurrent Fetching: The Open-Meteo API splits weather and air quality data across different endpoints. Instead of fetching them sequentially, the weatherService uses Promise.all to fire both requests simultaneously, effectively cutting the network waiting time in half.

2.  Perceived Performance: Nobody likes a blank white screen. I built skeleton loaders that paint the UI structure in under 150ms while the data pipeline resolves in the background.

3.  Data Transformation on the Fly: The raw JSON from Open-Meteo is complex and deeply nested. I wrote utility functions to "zip" the arrays into clean, flat objects before handing them down to the React components. This keeps the React render cycle incredibly light.

Handling Edge Cases: The Location Problem
Users deny browser GPS permissions all the time. If an app just crashes or hangs forever when they click "Block," that's a bad product.

To handle this, I built a custom useGeolocation hook. It attempts to use the highly accurate native browser GPS first (with a strict 5-second timeout so it doesn't hang indefinitely). If the user denies permission, or their hardware signal is terrible, it instantly catches the error and gracefully falls back to a lightweight IP-to-location API. The user gets their local weather seamlessly, no matter what.

Tech Stack & Architecture Choices

Vite + React: Chosen over Create React App because the local build times are significantly faster and the production bundle is much lighter.

Tailwind CSS: Used for all styling. It allowed me to build responsive, mobile-first CSS grids without writing a single line of custom CSS or relying on heavy component libraries.

Recharts: Visualizing 2 years of daily weather data requires rendering thousands of SVG nodes. Recharts handles massive datasets smoothly and includes a native \<Brush /\> component that handles interactive zooming and horizontal scrolling perfectly on mobile.

State Management: I used React's native Context API to build a global data provider. Heavy libraries like Redux or Zustand would have 
been total overkill for a dashboard of this size and would have unnecessarily bloated the bundle.

Website URL
https://weather-app-eight-chi-32.vercel.app/

Local Setup
To pull this project down and run it locally:

Clone the repository
git clone https://github.com/vexnar404/weather-app


Install dependencies
npm install

Start the local development server
npm run dev

Note: To audit the actual optimized load speeds, run npm run build followed by npm run preview to simulate the minified production environment.