import React, { useState } from "react";
import { Search, BookOpen, Loader2, AlertCircle } from "lucide-react";

const DictionaryApp = () => {
  const [inputText, setInputText] = useState("");
  const [results, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const definition = await fetchDefinition(inputText.trim());

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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-teal-50 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                  <div className="flex items-center justify-center mb-4">
                      <div className="bg-teal-400 p-3 rounded-full shadow-lg">
                          <BookOpen className="w-8 h-8 text-white" />
                      </div>
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent mb-2">
                      Dictionary Explorer
                  </h1>
                  <p className="text-gray-600 text-lg">Discover the meaning of words</p>
              </div>

              {/* Search Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 backdrop-blur-sm border border-teal-100">
                  <label className="block text-lg font-semibold text-gray-700 mb-4">
                      Enter a word to search
                  </label>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                          <textarea
                              value={inputText}
                              onChange={e => setInputText(e.target.value)}
                              onKeyDown={handleKeyPress}
                              placeholder="Type your word here..."
                              className="w-full p-4 border-2 border-teal-200 rounded-xl focus:border-teal-400 focus:ring-4 focus:ring-teal-100 outline-none transition-all duration-300 resize-none text-lg"
                              rows="3"
                          />
                      </div>
                      
                      <button 
                          onClick={handleSearch} 
                          disabled={loading || !inputText.trim()}
                          className="bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                      >
                          {loading ? (
                              <>
                                  <Loader2 className="animate-spin w-5 h-5" />
                                  Searching...
                              </>
                          ) : (
                              <>
                                  <Search className="w-5 h-5" />
                                  Search
                              </>
                          )}
                      </button>
                  </div>
              </div>

              {/* Error Message */}
              {error && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 mb-8 flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 font-medium">{error}</p>
                  </div>
              )}

              {/* Results */}
              {results.length > 0 && (
                  <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Definition Results</h2>
                      {results.map((result, index) => (
                          <div 
                              key={index} 
                              className="bg-white rounded-2xl shadow-lg p-8 border border-teal-100 hover:shadow-xl transition-shadow duration-300"
                          >
                              <div className="mb-6">
                                  <span className="inline-block bg-gradient-to-r from-teal-400 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
                                      {result.partOfSpeech}
                                  </span>
                              </div>
                              
                              <div className="space-y-4">
                                  {result.definitions.map((definition, defIndex) => (
                                      <div key={defIndex} className="border-l-4 border-teal-200 pl-6 py-2">
                                          <p className="text-gray-800 text-lg leading-relaxed mb-3">
                                              {definition.definition}
                                          </p>
                                          {definition.example && (
                                              <div className="bg-gradient-to-r from-pink-50 to-teal-50 rounded-lg p-4 border border-pink-100">
                                                  <p className="text-gray-600 italic text-base">
                                                      <span className="font-semibold text-teal-600">Example:</span> {definition.example}
                                                  </p>
                                              </div>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
              )}

              {/* Empty State */}
              {!loading && !error && results.length === 0 && inputText === "" && (
                  <div className="text-center py-16">
                      <div className="bg-gradient-to-r from-teal-100 to-pink-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                          <Search className="w-12 h-12 text-teal-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">Ready to explore?</h3>
                      <p className="text-gray-500">Enter a word above to get started with your search.</p>
                  </div>
              )}
          </div>
      </div>
  )
}

function App() {
  return (
    <DictionaryApp />
  )
}

export default App