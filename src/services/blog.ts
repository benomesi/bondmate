import { supabase } from '../lib/supabase';
import type { BlogPost, BlogCategory } from '../types';

export class BlogService {
  async getPosts(): Promise<{ posts: BlogPost[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          category:blog_categories(*),
          author:profiles(name)
        `)
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return { posts: data as BlogPost[], error: null };
    } catch (error) {
      console.error('Get posts error:', error);
      return { posts: [], error: error as Error };
    }
  }

  async getPost(slug: string): Promise<{ post: BlogPost | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          category:blog_categories(*),
          author:profiles(name)
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return { post: data as BlogPost, error: null };
    } catch (error) {
      console.error('Get post error:', error);
      return { post: null, error: error as Error };
    }
  }

  async getCategories(): Promise<{ categories: BlogCategory[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return { categories: data as BlogCategory[], error: null };
    } catch (error) {
      console.error('Get categories error:', error);
      return { categories: [], error: error as Error };
    }
  }
}

export const blogService = new BlogService();