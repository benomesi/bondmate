/*
  # Seed Blog Posts and Authors

  1. New Data
    - Add initial blog posts with content
    - Add author profiles
    - Link posts to existing categories

  2. Changes
    - Create auth.users for authors
    - Insert author profiles
    - Insert sample blog posts
*/

-- Create auth users for authors
INSERT INTO auth.users (id, email, created_at)
VALUES 
  ('d0d8c19c-1c99-4e9b-9d34-c6ef7cb7c123', 'sarah.johnson@example.com', now()),
  ('e1d9c29c-2c99-5e9b-9d34-c6ef7cb7c456', 'michael.chen@example.com', now()),
  ('f2d0c39c-3c99-6e9b-9d34-c6ef7cb7c789', 'emily.rodriguez@example.com', now())
ON CONFLICT (id) DO NOTHING;

-- Insert author profiles
INSERT INTO profiles (id, name, is_admin)
VALUES 
  ('d0d8c19c-1c99-4e9b-9d34-c6ef7cb7c123', 'Dr. Sarah Johnson', true),
  ('e1d9c29c-2c99-5e9b-9d34-c6ef7cb7c456', 'Michael Chen', true),
  ('f2d0c39c-3c99-6e9b-9d34-c6ef7cb7c789', 'Emily Rodriguez', true)
ON CONFLICT (id) DO NOTHING;

-- Insert blog posts
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  image_url,
  category_id,
  author_id,
  published,
  published_at
)
SELECT
  '5 Communication Techniques for Better Relationships',
  'communication-techniques',
  'Learn effective strategies to improve your communication and strengthen your bonds with loved ones.',
  E'Communication is the cornerstone of any healthy relationship. Here are five proven techniques to enhance your connection:\n\n1. Active Listening\nPractice being fully present when your partner speaks. Put away distractions, maintain eye contact, and focus on understanding rather than responding.\n\n2. "I" Statements\nExpress your feelings using "I" statements instead of accusatory "you" statements. For example, say "I feel frustrated when..." instead of "You always..."\n\n3. Emotional Validation\nAcknowledge your partner''s feelings even if you disagree with their perspective. Simple phrases like "I understand why you''d feel that way" can make a big difference.\n\n4. Regular Check-ins\nSchedule dedicated time to discuss your relationship, goals, and any concerns. This prevents small issues from becoming major problems.\n\n5. Non-verbal Communication\nBe mindful of your body language, tone of voice, and facial expressions. These often communicate more than words alone.',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
  (SELECT id FROM blog_categories WHERE slug = 'communication'),
  'e1d9c29c-2c99-5e9b-9d34-c6ef7cb7c456',
  true,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM blog_posts WHERE slug = 'communication-techniques'
);

INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  image_url,
  category_id,
  author_id,
  published,
  published_at
)
SELECT
  'Understanding Love Languages in Modern Relationships',
  'understanding-love-languages',
  'Discover how understanding and speaking your partner''s love language can transform your relationship.',
  E'Love languages are the different ways people give and receive love. Understanding them is crucial for building stronger connections.\n\nThe Five Love Languages:\n\n1. Words of Affirmation\nVerbal expressions of love, appreciation, and encouragement. Simple compliments and "I love you" mean the world to these people.\n\n2. Acts of Service\nActions speak louder than words. Helping with tasks, taking care of responsibilities, or making life easier shows love.\n\n3. Receiving Gifts\nThoughtful presents and tokens of affection, big or small, make these people feel special and remembered.\n\n4. Quality Time\nUndivided attention and shared experiences matter most. It''s about being present and engaged together.\n\n5. Physical Touch\nPhysical affection like hugs, kisses, and holding hands creates connection and security.\n\nIdentifying and speaking your partner''s love language can dramatically improve your relationship satisfaction.',
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
  (SELECT id FROM blog_categories WHERE slug = 'relationships'),
  'd0d8c19c-1c99-4e9b-9d34-c6ef7cb7c123',
  true,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM blog_posts WHERE slug = 'understanding-love-languages'
);

INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  image_url,
  category_id,
  author_id,
  published,
  published_at
)
SELECT
  'Building Trust: The Foundation of Strong Relationships',
  'building-trust',
  'Explore practical ways to build and maintain trust in all your relationships.',
  E'Trust is the bedrock of every successful relationship. Here''s how to build and maintain it:\n\n1. Consistency\nBe reliable and follow through on your commitments. Small, consistent actions build trust over time.\n\n2. Transparency\nBe honest about your thoughts, feelings, and actions. Open communication prevents misunderstandings.\n\n3. Respect Boundaries\nUnderstand and honor each other''s limits and personal space. This shows respect for individual needs.\n\n4. Take Responsibility\nOwn your mistakes and apologize sincerely when needed. This shows maturity and builds credibility.\n\n5. Show Vulnerability\nShare your fears, dreams, and insecurities. This deepens emotional connection and trust.\n\nRemember, trust takes time to build but can be broken quickly. Protect it carefully.',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
  (SELECT id FROM blog_categories WHERE slug = 'trust'),
  'f2d0c39c-3c99-6e9b-9d34-c6ef7cb7c789',
  true,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM blog_posts WHERE slug = 'building-trust'
);