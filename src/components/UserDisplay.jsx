import React, { useState } from 'react';
import { User, LogOut, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';

const UserDisplay = ({ user, onShowBookmarks }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
  };

  const handleShowBookmarks = () => {
    onShowBookmarks();
    setShowDropdown(false);
  };

  if (!user) return null;

  const displayName = user.user_metadata?.full_name || user.email;
  let avatarUrl = user.user_metadata?.avatar_url;

  // Fix Google avatar URL to ensure it loads properly
  if (avatarUrl && avatarUrl.includes('googleusercontent.com')) {
    // Remove size parameter and ensure https
    avatarUrl = avatarUrl.replace(/=s\d+-c/, '=s96-c').replace(/^http:/, 'https:');
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-1 rounded-full bg-white/80 backdrop-blur-sm border border-teal-100 hover:bg-white hover:shadow-md transition-all duration-300"
      >
        {avatarUrl && !imageError ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-teal-100 py-2 z-50">
          <button
            onClick={handleShowBookmarks}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-teal-50 flex items-center gap-3 transition-colors duration-200"
          >
            <BookOpen className="w-4 h-4 text-teal-500" />
            My Bookmarks
          </button>
          <hr className="my-1 border-gray-100" />
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-3 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDisplay;