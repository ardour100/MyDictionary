import React, { useState } from "react";
import { Search, BookOpen, Loader2, AlertCircle } from "lucide-react";

const DictionaryApp = () => {
  const [inputText, setInputText] = useState("");
  const [results, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const translations = {
      'hello': 'hi'
  };

  const fetchDefinition = async (word) => {
      try {
          const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
          const data = await response.json();
          return data[0];
      } catch (err) {
          return null;
      }
  }

  const handleSearch = async () => {
      setLoading(true);
      setError("");
      setResult([]);

      const translatedWord = translations[inputText.toLowerCase()] || inputText;
      const definition = await fetchDefinition(translatedWord);

      if (definition) {
          setResult(definition.meanings);
      } else {
          setError("No definition found for the word.");
      }

      setLoading(false);
  }

  const handleKeyPress = e => {
      if (e.key === 'Enter') {
          handleSearch();
      }
  }

  return (
      <div className="min-h-screen">
          <label className="block text-sm front-medium text-gray-700 mb-3">
              Enter words
          </label>
          <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
          />

          <button onClick={handleSearch} disabled={loading} >
              {loading ? <Loader2 className="animate-spin" /> : <Search />}
              {loading ? "Searching..." : "Search"}
          </button>

          {results.length > 0 && (
            <div className="space-y-4">
                {results.map((result, index) => (
                    <div key={index}>
                        <div>{result.partOfSpeech}</div>
                        {result.definitions.map((definition, defIndex) => (
                            <div key={defIndex} className="ml-4">
                                <p>{definition.definition}</p>
                                {definition.example && <p className="italic">Example: {definition.example}</p>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        )}
      </div>

  )

}

function App() {

  return (
    <DictionaryApp />
  )
}

export default App
