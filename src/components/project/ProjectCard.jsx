import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { 
  Folder, 
  Globe, 
  Lock, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Link,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

export const ProjectCard = ({
  project,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const isOwner = user && user.id === project.owner_id;

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    const publicLink = `${window.location.origin}/p/${project.slug}`;
    navigator.clipboard.writeText(publicLink);
    toast.success('Public project share link copied to clipboard!');
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative premium-card premium-card-hover rounded-2xl overflow-hidden cursor-pointer flex flex-col h-[280px]"
    >
      {/* Thumbnail Area */}
      <div className="relative h-36 bg-[#0f1117] flex items-center justify-center border-b border-white/[0.07] overflow-hidden flex-shrink-0">
        {project.thumbnail_url ? (
          <img 
            src={project.thumbnail_url} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 gap-2">
            <Folder className="w-10 h-10 text-primary-600/60 group-hover:text-primary-500/80 transition-colors duration-300" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-600">No Preview</span>
          </div>
        )}

        {/* Visibility Badge (Top Left Overlay) */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant={project.visibility === 'public' ? 'success' : 'gray'}>
            <span className="flex items-center gap-1">
              {project.visibility === 'public' ? (
                <>
                  <Globe className="w-3 h-3" /> Public
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" /> Private
                </>
              )}
            </span>
          </Badge>
        </div>

        {/* Options Dropdown Menu (Top Right Overlay) */}
        {isOwner && (
          <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg bg-[#141620]/85 hover:bg-[#1d2130] border border-white/[0.08] text-gray-400 hover:text-gray-200 transition-colors backdrop-blur"
              aria-label="Project actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-1.5 w-32 bg-[#1a1d27] border border-white/[0.10] rounded-xl shadow-2xl shadow-black/50 py-1 z-20">
                  <button
                    onClick={() => {
                      onEdit(project);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-surface-hover hover:text-white transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete(project.id);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-[#ffe4e6]/5 hover:text-rose-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Info details */}
      <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {project.category && (
              <span className="text-[10px] font-bold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                {project.category}
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-gray-200 group-hover:text-primary-400 transition-colors truncate">
            {project.title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {project.description || 'No description provided.'}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 mt-3">
          <span className="text-[10px] text-gray-500 font-medium">
            Updated {new Date(project.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>

          {project.visibility === 'public' ? (
            <button
              onClick={handleShareClick}
              className="text-[10px] font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors px-2 py-1 bg-primary-500/10 border border-primary-500/20 rounded-md"
            >
              <Link className="w-3 h-3" /> Share
            </button>
          ) : (
            <span className="text-[10px] text-gray-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Open <ArrowRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
