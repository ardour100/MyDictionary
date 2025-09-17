import React, { useState, useEffect } from 'react';
import { X, Trash2, BookOpen, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

const BookmarkedWords = ({ user, onClose }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState(null);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookmarked_words')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookmarks:', error);
        return;
      }

      setBookmarks(data || []);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (bookmarkId) => {
    try {
      const { error } = await supabase
        .from('bookmarked_words')
        .delete()
        .eq('id', bookmarkId);

      if (error) {
        console.error('Error removing bookmark:', error);
        return;
      }

      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
      if (selectedWord && selectedWord.id === bookmarkId) {
        setSelectedWord(null);
      }
    } catch (err) {
      console.error('Error removing bookmark:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading your bookmarks...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-400 to-teal-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-2xl font-bold">My Bookmarks</h2>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {bookmarks.length} word{bookmarks.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200 text-white hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Close bookmarks"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-full max-h-[calc(90vh-100px)]">
          {/* Bookmarks List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            {bookmarks.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium mb-2">No bookmarks yet</p>
                <p className="text-sm">Start searching for words and bookmark them to build your personal dictionary!</p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer group ${
                      selectedWord?.id === bookmark.id
                        ? 'bg-teal-50 border-teal-200'
                        : 'bg-white border-gray-200 hover:border-teal-200 hover:bg-teal-50'
                    }`}
                    onClick={() => setSelectedWord(bookmark)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 capitalize">
                          {bookmark.word}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(bookmark.created_at)}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(bookmark.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-full text-red-500 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Definition Display */}
          <div className="flex-1 overflow-y-auto">
            {selectedWord ? (
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 capitalize">
                  {selectedWord.word}
                </h1>

                {selectedWord.definition_data.meanings?.map((meaning, index) => (
                  <div key={index} className="mb-6">
                    <span className="inline-block bg-gradient-to-r from-teal-400 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
                      {meaning.partOfSpeech}
                    </span>

                    <div className="space-y-4">
                      {meaning.definitions?.map((definition, defIndex) => (
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
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Select a word to view its definition</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkedWords;