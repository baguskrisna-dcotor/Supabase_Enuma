import { supabase } from '../lib/supabase';
import { slugify } from '../utils/slugify';

export const projectService = {
  /**
   * Fetch all projects owned by the user
   */
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch a single project by its ID
   */
  async getProjectById(projectId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*, owner:profiles(*)')
      .eq('id', projectId)
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Fetch all public projects (for Explore page — no auth required)
   */
  async getPublicProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*, owner:profiles(username, full_name)')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch a project by its slug (for public page access)
   */
  async getProjectBySlug(slug) {
    const { data, error } = await supabase
      .from('projects')
      .select('*, owner:profiles(*)')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Create a new project
   */
  async createProject({ title, description, visibility, category, ownerId }) {
    const slug = slugify(title);
    const { data, error } = await supabase
      .from('projects')
      .insert({
        owner_id: ownerId,
        title,
        description,
        visibility,
        category,
        slug,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Update an existing project
   */
  async updateProject(projectId, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Delete a project
   */
  async deleteProject(projectId) {
    // Note: Database cascade deletes public.folders and public.files.
    // However, storage objects are not automatically deleted.
    // To keep it clean, we can try listing files in storage under `{ownerId}/{projectId}` and deleting them.
    // For MVP, deleting the project row is the priority.
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    if (error) throw error;
  },

  /**
   * Upload thumbnail to `thumbnails` bucket and update project thumbnail_url
   */
  async uploadThumbnail(projectId, ownerId, file) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${ownerId}/${projectId}/thumbnail_${Date.now()}.${fileExt}`;

    // 1. Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('thumbnails')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 2. Get public url
    const { data: { publicUrl } } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(filePath);

    // 3. Update project record
    await this.updateProject(projectId, { thumbnail_url: publicUrl });

    return publicUrl;
  },
};
