/*
  # Initial Schema Setup

  1. Tables
    - profiles: User profiles with basic info and preferences
    - relationships: User relationship tracking
    - messages: Chat messages between users and AI
    - blog_posts: Blog content management
    - blog_categories: Blog categorization

  2. Security
    - RLS enabled on all tables
    - Policies for authenticated users
    - Triggers for timestamp management
*/

-- Drop existing tables in correct order to handle dependencies
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS relationships;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS blog_categories;
DROP TABLE IF EXISTS profiles;

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  interests text[] DEFAULT '{}',
  goals text[] DEFAULT '{}',
  communication_style text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog categories table
CREATE TABLE blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create blog posts table
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  image_url text,
  category_id uuid REFERENCES blog_categories(id),
  author_id uuid REFERENCES profiles(id),
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create relationships table
CREATE TABLE relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  interests text[] DEFAULT '{}',
  goals text[] DEFAULT '{}',
  communication_style text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id uuid REFERENCES relationships ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_ai boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for relationships
CREATE POLICY "Users can read own relationships"
  ON relationships
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own relationships"
  ON relationships
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own relationships"
  ON relationships
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own relationships"
  ON relationships
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for messages
CREATE POLICY "Users can read messages from their relationships"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    relationship_id IN (
      SELECT id FROM relationships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their relationships"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    relationship_id IN (
      SELECT id FROM relationships WHERE user_id = auth.uid()
    )
  );

-- Create policies for blog categories
CREATE POLICY "Blog categories are viewable by everyone"
  ON blog_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Blog categories can be managed by admins"
  ON blog_categories
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  ));

-- Create policies for blog posts
CREATE POLICY "Published blog posts are viewable by everyone"
  ON blog_posts
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Blog posts can be managed by admins"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relationships_updated_at
  BEFORE UPDATE ON relationships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Communication', 'communication', 'Articles about improving communication in relationships'),
  ('Trust', 'trust', 'Building and maintaining trust in relationships'),
  ('Personal Growth', 'personal-growth', 'Self-improvement and personal development'),
  ('Relationships', 'relationships', 'General relationship advice and insights')
ON CONFLICT (slug) DO NOTHING;