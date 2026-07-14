import { supabase } from '../lib/supabase';

export const folderService = {
  /**
   * Fetch all folders in a project
   */
  async getFoldersByProject(projectId) {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('project_id', projectId)
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  /**
   * Create a new folder
   */
  async createFolder({ name, projectId, userId }) {
    const { data, error } = await supabase
      .from('folders')
      .insert({
        name,
        project_id: projectId,
        user_id: userId,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Delete a folder.
   * Cascade rule will set `folder_id` of files to NULL, so files are preserved but are no longer in folder.
   */
  async deleteFolder(folderId) {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId);
    if (error) throw error;
  },
};
