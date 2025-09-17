-- Migration: Create bookmarked_words table
-- This should be run in your Supabase SQL Editor

-- Create bookmarked_words table for storing user's saved words
CREATE TABLE IF NOT EXISTS bookmarked_words (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    definition_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for efficient user queries
CREATE INDEX IF NOT EXISTS idx_bookmarked_words_user_id ON bookmarked_words(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarked_words_word ON bookmarked_words(word);

-- Enable Row Level Security
ALTER TABLE bookmarked_words ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own bookmarked words" ON bookmarked_words
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarked words" ON bookmarked_words
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarked words" ON bookmarked_words
    FOR DELETE USING (auth.uid() = user_id);