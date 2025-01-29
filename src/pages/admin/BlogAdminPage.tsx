import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { getBlogPosts, getBlogCategories, deleteBlogPost } from '../../lib/blog';
import { BlogPostModal } from '../../components/admin/BlogPostModal';
import { useAppSelector } from '../../hooks/useAppSelector';

export function BlogAdminPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ... (keep rest of the component implementation)
}