import { supabase } from '../lib/supabase';

export const fileService = {
  /**
   * Fetch all files in a project
   */
  async getFilesByProject(projectId) {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('project_id', projectId)
      .order('uploaded_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch all files in a folder
   */
  async getFilesByFolder(projectId, folderId) {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('project_id', projectId)
      .eq('folder_id', folderId)
      .order('uploaded_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  /**
   * Upload a file to storage and insert DB record
   */
  async uploadFile({ projectId, folderId, userId, file }) {
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const storagePath = `${userId}/${projectId}/${timestamp}_${cleanFileName}`;

    // 1. Upload file to private storage bucket `project-files`
    const { error: uploadError } = await supabase.storage
      .from('project-files')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // 2. Insert record into `files` table
    try {
      const { data, error: dbError } = await supabase
        .from('files')
        .insert({
          project_id: projectId,
          folder_id: folderId || null,
          user_id: userId,
          name: file.name,
          original_name: file.name,
          size: file.size,
          mime_type: file.type || 'application/octet-stream',
          storage_path: storagePath,
        })
        .select()
        .single();

      if (dbError) {
        // Rollback storage upload on DB error
        await supabase.storage.from('project-files').remove([storagePath]);
        throw dbError;
      }

      return data;
    } catch (err) {
      // Ensure storage is clean if DB fails
      await supabase.storage.from('project-files').remove([storagePath]);
      throw err;
    }
  },

  /**
   * Delete a file from both DB and storage
   */
  async deleteFile(fileId, storagePath) {
    // 1. Delete from DB
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId);

    if (dbError) throw dbError;

    // 2. Delete from storage
    const { error: storageError } = await supabase.storage
      .from('project-files')
      .remove([storagePath]);

    if (storageError) throw storageError;
  },

  /**
   * Create a temporary signed URL for downloading/previewing
   */
  async getDownloadUrl(storagePath) {
    const { data, error } = await supabase.storage
      .from('project-files')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry

    if (error) throw error;
    return data.signedUrl;
  },

  /**
   * Download the file directly as a Blob
   */
  async downloadBlob(storagePath) {
    const { data, error } = await supabase.storage
      .from('project-files')
      .download(storagePath);

    if (error) throw error;
    return data;
  },
};
