'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';

interface Link {
  id: string;
  title: string;
  url: string;
  click_count: number;
  user_id: string;
}

interface UserLinksProps {
  userId: string;
  isOwner?: boolean;
}

export default function UserLinks({ userId, isOwner = false }: UserLinksProps) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [userId]);

  const handleClick = async (link: Link) => {
    try {
      const { error } = await supabase
        .from('links')
        .update({ click_count: link.click_count + 1 })
        .eq('id', link.id);

      if (error) throw error;

      window.open(link.url, '_blank');
      setLinks(links.map(l => 
        l.id === link.id ? { ...l, click_count: l.click_count + 1 } : l
      ));
    } catch (error: any) {
      console.error('Error updating click count:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setLinks(links.filter(link => link.id !== id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    try {
      const { error } = await supabase
        .from('links')
        .update({
          title: editingLink.title,
          url: editingLink.url,
        })
        .eq('id', editingLink.id);

      if (error) throw error;

      setLinks(links.map(link =>
        link.id === editingLink.id ? editingLink : link
      ));
      setEditingLink(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) return <div className="text-white/70">Loading links...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!links.length) return <div className="text-white/70">No links added yet.</div>;

  return (
    <div className="space-y-4">
      {links.map(link => (
        <div
          key={link.id}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
        >
          {editingLink?.id === link.id ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                value={editingLink.title}
                onChange={e => setEditingLink({ ...editingLink, title: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                required
              />
              <input
                type="url"
                value={editingLink.url}
                onChange={e => setEditingLink({ ...editingLink, url: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mb-1">{link.title}</h3>
                <p className="text-white/60 text-sm">
                  {link.click_count} clicks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleClick(link)}
                  className="p-2 text-white/80 hover:text-white transition-colors"
                  title="Open link"
                >
                  <ExternalLink size={20} />
                </button>
                {isOwner && (
                  <>
                    <button
                      onClick={() => setEditingLink(link)}
                      className="p-2 text-white/80 hover:text-white transition-colors"
                      title="Edit link"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-2 text-white/80 hover:text-white transition-colors"
                      title="Delete link"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 