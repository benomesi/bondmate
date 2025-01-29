// Temporary in-memory blog storage until we implement new auth
const blogPosts = [
  {
    id: '1',
    title: '5 Communication Techniques for Better Relationships',
    slug: 'communication-techniques',
    excerpt: 'Learn effective strategies to improve your communication and strengthen your bonds with loved ones.',
    content: 'Communication is the cornerstone of any healthy relationship...',
    image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
    category: { name: 'Communication' },
    author: { name: 'Dr. Sarah Johnson' },
    published: true,
    published_at: new Date('2024-02-15').toISOString()
  },
  // Add more sample posts as needed
];

export type BlogPost = typeof blogPosts[0];
export type BlogCategory = { id: string; name: string; };

export async function getBlogPosts() {
  return blogPosts;
}

export async function getBlogPost(slug: string) {
  return blogPosts.find(post => post.slug === slug) || null;
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
  const newPost = {
    ...post,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  blogPosts.push(newPost);
  return newPost;
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>) {
  const index = blogPosts.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Post not found');
  
  blogPosts[index] = {
    ...blogPosts[index],
    ...post,
    updated_at: new Date().toISOString()
  };
  return blogPosts[index];
}

export async function deleteBlogPost(id: string) {
  const index = blogPosts.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Post not found');
  blogPosts.splice(index, 1);
}

export async function getBlogCategories() {
  return [
    { id: '1', name: 'Communication' },
    { id: '2', name: 'Trust' },
    { id: '3', name: 'Personal Growth' },
    { id: '4', name: 'Relationships' }
  ];
}