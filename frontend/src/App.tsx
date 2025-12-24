import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Search, History, Star, Trash2 } from 'lucide-react'; // הוספנו Trash2

interface Character {
  name: string;
  height: string;
  birthYear: string;
  gender: string;
}

interface HistoryItem {
  id: number;
  term: string;
  createdAt: string;
}

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/search-history');
      setHistory(res.data);
    } catch (err) {
      console.error("Error loading history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = async (term: string) => {
    if (!term) return;
    setLoading(true);
    setError('');
    setResult(null);
    setQuery(term);

    try {
      const res = await axios.get(`http://localhost:3001/api/characters?search=${term}`);
      if (res.data.results.length > 0) {
        setResult(res.data.results[0]);
      } else {
        setError('No Jedi found with that name...');
      }
      fetchHistory();
    } catch (err) {
      setError('Connection to the Force lost (Server Error)');
    } finally {
      setLoading(false);
    }
  };

  // --- פונקציה חדשה למחיקה ---
  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // מונע מהלחיצה על הפח להפעיל גם חיפוש
    try {
      await axios.delete(`http://localhost:3001/api/search-history/${id}`);
      fetchHistory(); // רענון הרשימה אחרי מחיקה
    } catch (err) {
      console.error("Error deleting item", err);
    }
  };

  return (
    <div className="container">
      <h1>Star Wars Search</h1>
      
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Enter character name (e.g. Yoda)..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
        />
        <button onClick={() => handleSearch(query)}>
          <Search size={20} /> Search
        </button>
      </div>

      {loading && <div className="loading">Using the Force...</div>}
      
      {error && <div className="card" style={{borderColor: 'red', color: 'red'}}>{error}</div>}

      {result && (
        <div className="card">
          <h2><Star fill="yellow" className="icon"/> {result.name}</h2>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px'}}>
            <div><strong>Height:</strong> {result.height} cm</div>
            <div><strong>Birth Year:</strong> {result.birthYear}</div>
            <div><strong>Gender:</strong> {result.gender}</div>
          </div>
        </div>
      )}

      <div className="history-panel">
        <h3><History size={18}/> Recent Searches</h3>
        <div>
          {history.map((item) => (
            <div 
              key={item.id} 
              className="history-item"
              onClick={() => handleSearch(item.term)}
              style={{display: 'inline-flex', alignItems: 'center', gap: '8px'}}
            >
              <span>{item.term}</span>
              {/* כפתור המחיקה החדש */}
              <Trash2 
                size={14} 
                color="#ff4444" 
                onClick={(e) => handleDelete(e, item.id)}
                style={{cursor: 'pointer'}}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;