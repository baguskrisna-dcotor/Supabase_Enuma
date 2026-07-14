import React from 'react';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from '../ui/EmptyState';
import { FolderPlus } from 'lucide-react';
import { Button } from '../ui/Button';

export const ProjectGrid = ({
  projects = [],
  onEdit,
  onDelete,
  onCreateClick,
  searchQuery = '',
}) => {
  if (projects.length === 0) {
    if (searchQuery) {
      return (
        <EmptyState
          title="No matching projects"
          description={`We couldn't find any projects matching "${searchQuery}". Try adjusting your filters or spelling.`}
        />
      );
    }

    return (
      <EmptyState
        title="No projects yet"
        description="Create your first project workspace to start organizing your files and documents."
        actionButton={
          onCreateClick ? (
            <Button onClick={onCreateClick} className="flex items-center gap-2">
              <FolderPlus className="w-4 h-4" /> Create Project
            </Button>
          ) : null
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
export default ProjectGrid;
