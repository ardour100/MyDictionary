import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

const BookmarkButton = ({ word, definitionData, translations, user }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && word) {
      checkIfBookmarked();
    }
  }, [user, word]);

  const checkIfBookmarked = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarked_words')
        .select('id')
        .eq('user_id', user.id)
        .eq('word', word.toLowerCase());

      if (error) {
        console.error('Error checking bookmark:', error);
        return;
      }

      setIsBookmarked(data && data.length > 0);
    } catch (err) {
      console.error('Error checking bookmark:', err);
    }
  };

  const toggleBookmark = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarked_words')
          .delete()
          .eq('user_id', user.id)
          .eq('word', word.toLowerCase());

        if (error) {
          console.error('Error removing bookmark:', error);
          return;
        }

        setIsBookmarked(false);
      } else {
        // Add bookmark
        const enhancedDefinitionData = {
          ...definitionData,
          translations: translations
        };

        const { error } = await supabase
          .from('bookmarked_words')
          .insert({
            user_id: user.id,
            word: word.toLowerCase(),
            definition_data: enhancedDefinitionData
          });

        if (error) {
          console.error('Error adding bookmark:', error);
          return;
        }

        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed ${
        isBookmarked
          ? 'bg-gradient-to-r from-teal-400 to-teal-500 text-white shadow-lg'
          : 'bg-white border-2 border-teal-200 text-teal-600 hover:border-teal-400 hover:shadow-md'
      }`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isBookmarked ? (
        <BookmarkCheck className="w-5 h-5" />
      ) : (
        <Bookmark className="w-5 h-5" />
      )}
      {loading ? 'Saving...' : isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
};

export default BookmarkButton;