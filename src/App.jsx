import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { WeatherProvider } from './context/WeatherContext'; // Import the provider
import CurrentWeather from './pages/CurrentWeather';
import HistoricalTrends from './pages/HistoricalTrends';

function App() {
  return (
    <WeatherProvider> {/* Wrap the app here */}
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <nav className="bg-white shadow-sm p-4 mb-6">
            <div className="max-w-6xl mx-auto flex gap-4 font-semibold">
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Current & Hourly
              </Link>
              <Link to="/history" className="hover:text-blue-600 transition-colors">
                Historical Trends
              </Link>
            </div>
          </nav>

          <main className="max-w-6xl mx-auto px-4">
            <Routes>
              <Route path="/" element={<CurrentWeather />} />
              <Route path="/history" element={<HistoricalTrends />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WeatherProvider>
  );
}

export default App;