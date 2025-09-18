import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Clock, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, SortAsc, SortDesc } from 'lucide-react';
import { supabase } from '../lib/supabase';

const BookmarksPage = ({ user, onBack }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at'); // 'created_at' or 'word'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  const itemsPerPage = 10;

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  useEffect(() => {
    applySort();
  }, [bookmarks, sortBy, sortOrder]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookmarked_words')
        .select('*')
        .eq('user_id', user.id);

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

  const applySort = () => {
    const sorted = [...bookmarks].sort((a, b) => {
      let aValue, bValue;

      if (sortBy === 'created_at') {
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
      } else {
        aValue = a.word.toLowerCase();
        bValue = b.word.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredBookmarks(sorted);
    setCurrentPage(1); // Reset to first page when sorting changes
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredBookmarks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookmarks = filteredBookmarks.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-teal-50">
        <div className="w-full max-w-none lg:max-w-full mx-auto p-2 sm:p-4 lg:p-6 xl:p-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 text-lg">Loading your bookmarks...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-teal-50">
      <div className="w-full max-w-none lg:max-w-full mx-auto p-2 sm:p-4 lg:p-6 xl:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-teal-200 hover:border-teal-400 hover:shadow-md transition-all duration-300 text-gray-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dictionary
            </button>
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-teal-500" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Bookmarks</h1>
              <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                {filteredBookmarks.length} word{filteredBookmarks.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Sorting Controls */}
          <div className="bg-white rounded-xl shadow-lg p-4 border border-teal-100">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <span className="text-gray-700 font-medium">Sort by:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleSort('created_at')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    sortBy === 'created_at'
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Bookmark Time
                  {sortBy === 'created_at' && (
                    sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => toggleSort('word')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    sortBy === 'word'
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  Alphabetical
                  {sortBy === 'word' && (
                    sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredBookmarks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookmarks yet</h3>
            <p className="text-gray-500">Start searching for words and bookmark them to build your personal dictionary!</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Bookmarks List */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-xl border border-teal-100">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Page {currentPage} of {totalPages}
                  </h2>
                </div>
                <div className="p-4 space-y-2">
                  {currentBookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${
                        selectedWord?.id === bookmark.id
                          ? 'bg-teal-50 border-teal-200'
                          : 'bg-white border-gray-200 hover:border-teal-200 hover:bg-teal-50'
                      }`}
                      onClick={() => setSelectedWord(bookmark)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 capitalize text-lg">
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
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 rounded-full text-red-500 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>

                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              page === currentPage
                                ? 'bg-teal-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Definition Display */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-xl border border-teal-100 min-h-[600px]">
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
                          {meaning.definitions?.map((definition, defIndex) => {
                            const translationKey = `${index}-${defIndex}`;
                            const chineseTranslation = selectedWord.definition_data.translations?.[translationKey];

                            return (
                              <div key={defIndex} className="border-l-4 border-teal-200 pl-6 py-2">
                                <p className="text-gray-800 text-lg leading-relaxed mb-2">
                                  {definition.definition}
                                </p>
                                {chineseTranslation && (
                                  <p className="text-gray-600 text-base leading-relaxed mb-3 pl-4 border-l-2 border-gray-200">
                                    {chineseTranslation}
                                  </p>
                                )}
                                {definition.example && (
                                  <div className="bg-gradient-to-r from-pink-50 to-teal-50 rounded-lg p-4 border border-pink-100">
                                    <p className="text-gray-600 italic text-base">
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
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;