import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const FolderForm = ({
  onSubmit,
  onClose,
  isLoading = false,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
    }
  });

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
      <Input
        label="Folder Name"
        placeholder="e.g. Design Assets, Documents"
        id="name"
        error={errors.name}
        {...register('name', { 
          required: 'Folder name is required',
          pattern: {
            value: /^[a-zA-Z0-9\s\-_]+$/,
            message: 'Folder name can only contain letters, numbers, spaces, hyphens, and underscores'
          }
        })}
      />

      <div className="flex justify-end gap-2 mt-2">
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
          Create Folder
        </Button>
      </div>
    </form>
  );
};
export default FolderForm;
