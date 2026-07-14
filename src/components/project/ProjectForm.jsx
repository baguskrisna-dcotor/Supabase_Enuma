import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { PROJECT_CATEGORIES } from '../../utils/constants';
import { UploadCloud, X, Globe, Lock } from 'lucide-react';

export const ProjectForm = ({
  project = null, // If present, we are editing
  onSubmit,
  onClose,
  isLoading = false,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      visibility: project?.visibility || 'private',
      category: project?.category || PROJECT_CATEGORIES[0],
    }
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(project?.thumbnail_url || null);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      thumbnail: thumbnailFile,
      // If we cleared the existing thumbnail and didn't upload a new one
      clearThumbnail: !thumbnailPreview && project?.thumbnail_url ? true : false,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
      {/* Title */}
      <Input
        label="Project Title"
        placeholder="e.g. My Cool Design Portfolio"
        id="title"
        error={errors.title}
        {...register('title', { required: 'Project title is required' })}
      />

      {/* Category */}
      <div className="w-full flex flex-col gap-1.5">
        <label htmlFor="category" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Category
        </label>
        <select
          id="category"
          className="w-full bg-[#151823] hover:bg-[#181b27] text-gray-100 text-sm rounded-xl border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all duration-200 px-3.5 py-2.5"
          {...register('category')}
        >
          {PROJECT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <Textarea
        label="Description (Optional)"
        placeholder="Brief details about what this project is..."
        id="description"
        error={errors.description}
        {...register('description')}
      />

      {/* Visibility */}
      <div className="w-full flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Visibility
        </span>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-3 p-3 bg-surface-card border border-white/[0.08] rounded-xl cursor-pointer hover:border-primary-500/35 hover:bg-primary-500/[0.04] transition-all">
            <input
              type="radio"
              value="private"
              className="text-primary-600 focus:ring-primary-500"
              {...register('visibility')}
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-400" /> Private
              </span>
              <span className="text-[10px] text-gray-500">Only you can view/upload</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-surface-card border border-white/[0.08] rounded-xl cursor-pointer hover:border-emerald-500/35 hover:bg-emerald-500/[0.04] transition-all">
            <input
              type="radio"
              value="public"
              className="text-primary-600 focus:ring-primary-500"
              {...register('visibility')}
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" /> Public
              </span>
              <span className="text-[10px] text-gray-500">Anyone with the link can view</span>
            </div>
          </label>
        </div>
      </div>

      {/* Thumbnail Upload */}
      <div className="w-full flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Project Cover Image (Optional)
        </span>
        
        {thumbnailPreview ? (
          <div className="relative w-full h-32 rounded-lg overflow-hidden border border-surface-border bg-surface-bg group">
            <img 
              src={thumbnailPreview} 
              alt="Thumbnail preview" 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveThumbnail}
              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-gray-300 hover:text-white rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/[0.10] hover:border-primary-500/40 rounded-2xl p-5 cursor-pointer bg-white/[0.025] hover:bg-primary-500/[0.04] transition-all text-gray-400">
            <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
            <span className="text-xs font-semibold">Upload a cover image</span>
            <span className="text-[10px] text-gray-500 mt-1">PNG, JPG or WebP (max. 5MB)</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
            />
          </label>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-surface-border/40">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {project ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};
export default ProjectForm;
