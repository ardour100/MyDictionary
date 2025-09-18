import React, { useState, useEffect } from "react";
import { Search, BookOpen, Loader2, AlertCircle, LogIn } from "lucide-react";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import UserDisplay from "./components/UserDisplay";
import BookmarkButton from "./components/BookmarkButton";
import BookmarkedWords from "./components/BookmarkedWords";

const DictionaryApp = () => {
  const [inputText, setInputText] = useState("");
  const [results, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchDefinition = async (word) => {
      try {
          const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
          const data = await response.json();
          return data[0];
      } catch (err) {
          console.error('Error fetching definition:', err);
          return null;
      }
  }

  const translateToChinese = async (text) => {
      try {
          // Using Google Translate API through a public endpoint
          const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh`);
          const data = await response.json();
          if (data.responseStatus === 200) {
              return data.responseData.translatedText;
          }
          return null;
      } catch (err) {
          console.error('Error translating to Chinese:', err);
          return null;
      }
  }

  const handleSearch = async () => {
      setLoading(true);
      setError("");
      setResult([]);
      setTranslations({});
      const definition = await fetchDefinition(inputText.trim());

      if (definition) {
          setResult(definition.meanings);

          // Fetch Chinese translations for all definitions
          const newTranslations = {};
          for (let meaningIndex = 0; meaningIndex < definition.meanings.length; meaningIndex++) {
              const meaning = definition.meanings[meaningIndex];
              for (let defIndex = 0; defIndex < meaning.definitions.length; defIndex++) {
                  const def = meaning.definitions[defIndex];
                  const key = `${meaningIndex}-${defIndex}`;
                  const translation = await translateToChinese(def.definition);
                  if (translation) {
                      newTranslations[key] = translation;
                  }
              }
          }
          setTranslations(newTranslations);
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

  const handleGoogleSignIn = async () => {
    if (!isSupabaseConfigured || !supabase) {
      alert('Supabase is not configured. Please set up your Supabase project and update the environment variables.');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) {
        console.error('Error signing in with Google:', error);
      }
    } catch (err) {
      console.error('Error signing in:', err);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-teal-50">
          <div className="w-full max-w-none lg:max-w-full mx-auto p-2 sm:p-4 lg:p-6 xl:p-8">
              {/* Header */}
              <div className="relative mb-8 sm:mb-12">
                  {/* User Display / Login Button */}
                  <div className="absolute top-0 right-0 z-10">
                      {isSupabaseConfigured ? (
                          user ? (
                              <UserDisplay
                                  user={user}
                                  onShowBookmarks={() => setShowBookmarks(true)}
                              />
                          ) : (
                              <button
                                  onClick={handleGoogleSignIn}
                                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white rounded-lg sm:rounded-xl border border-teal-200 hover:border-teal-400 hover:shadow-md transition-all duration-300 text-gray-700 font-medium text-sm sm:text-base"
                              >
                                  <LogIn className="w-4 h-4 text-teal-500" />
                                  <span className="hidden sm:inline">Sign in with Google</span>
                                  <span className="sm:hidden">Sign in</span>
                              </button>
                          )
                      ) : (
                          <div className="px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-xl text-yellow-800 text-sm">
                              Supabase not configured
                          </div>
                      )}
                  </div>

                  <div className="text-center pr-16 sm:pr-0">
                      <div className="flex items-center justify-center mb-3 sm:mb-4">
                          <div className="bg-teal-400 p-2 sm:p-3 rounded-full shadow-lg">
                              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                      </div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent mb-2">
                          Dictionary Explorer
                      </h1>
                      <p className="text-gray-600 text-base sm:text-lg lg:text-xl">Discover the meaning of words</p>
                  </div>
              </div>

              {/* Search Section */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 backdrop-blur-sm border border-teal-100">
                  <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                      Enter a word to search
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="flex-1">
                          <textarea
                              value={inputText}
                              onChange={e => setInputText(e.target.value)}
                              onKeyDown={handleKeyPress}
                              placeholder="Type your word here..."
                              className="w-full p-3 sm:p-4 border-2 border-teal-200 rounded-lg sm:rounded-xl focus:border-teal-400 focus:ring-4 focus:ring-teal-100 outline-none transition-all duration-300 resize-none text-base sm:text-lg"
                              rows="2"
                          />
                      </div>

                      <button
                          onClick={handleSearch}
                          disabled={loading || !inputText.trim()}
                          className="bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base"
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
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
                      <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
                  </div>
              )}

              {/* Results */}
              {results.length > 0 && (
                  <div className="space-y-4 sm:space-y-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Definition Results</h2>
                          {user && (
                              <BookmarkButton
                                  word={inputText.trim()}
                                  definitionData={{ meanings: results }}
                                  user={user}
                              />
                          )}
                      </div>
                      {results.map((result, index) => (
                          <div
                              key={index}
                              className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-teal-100 hover:shadow-xl transition-shadow duration-300"
                          >
                              <div className="mb-4 sm:mb-6">
                                  <span className="inline-block bg-gradient-to-r from-teal-400 to-teal-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide">
                                      {result.partOfSpeech}
                                  </span>
                              </div>
                              
                              <div className="space-y-3 sm:space-y-4">
                                  {result.definitions.map((definition, defIndex) => {
                                      const translationKey = `${index}-${defIndex}`;
                                      const chineseTranslation = translations[translationKey];

                                      return (
                                          <div key={defIndex} className="border-l-3 sm:border-l-4 border-teal-200 pl-3 sm:pl-6 py-2">
                                              <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-2">
                                                  {definition.definition}
                                              </p>
                                              {chineseTranslation && (
                                                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 pl-2 sm:pl-4 border-l-2 border-gray-200">
                                                      {chineseTranslation}
                                                  </p>
                                              )}
                                              {definition.example && (
                                                  <div className="bg-gradient-to-r from-pink-50 to-teal-50 rounded-lg p-3 sm:p-4 border border-pink-100">
                                                      <p className="text-gray-600 italic text-sm sm:text-base">
                                                          <span className="font-semibold text-teal-600">Example:</span> {definition.example}
                                                      </p>
                                                  </div>
                                              )}
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      ))}
                  </div>
              )}

              {/* Empty State */}
              {!loading && !error && results.length === 0 && inputText === "" && (
                  <div className="text-center py-12 sm:py-16">
                      <div className="bg-gradient-to-r from-teal-100 to-pink-100 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                          <Search className="w-8 h-8 sm:w-12 sm:h-12 text-teal-500" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Ready to explore?</h3>
                      <p className="text-gray-500 text-sm sm:text-base">Enter a word above to get started with your search.</p>
                  </div>
              )}

              {/* Bookmarked Words Modal */}
              {showBookmarks && (
                  <BookmarkedWords
                      user={user}
                      onClose={() => setShowBookmarks(false)}
                  />
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