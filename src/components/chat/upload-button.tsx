'use client';

import { PlusCircle } from 'lucide-react';
import { Progress } from '../ui/progress';

import { useCallback, useState } from 'react';
import { useDropzone } from '@uploadthing/react';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { useUploadThing } from '@/utils/uploadthing';

interface Props {
  onUploaded: (url: string) => void;
  onSelect: (url: File[]) => void;
}

export default function UploadButton({ onUploaded, onSelect }: Props) {
  const [progress, setProgress] = useState<number>(0);

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: async (res) => {
      onUploaded(res[0].url);
    },
    onUploadError: () => {
      console.log('error occurred while uploading');
    },
    onUploadBegin: () => {
      console.log('upload has begun');
    },
    onUploadProgress: (progress) => {
      setProgress(progress);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onSelect(acceptedFiles);
      startUpload(acceptedFiles);
    },
    [onSelect, startUpload]
  );

  const fileTypes = permittedFileInfo?.config ? Object.keys(permittedFileInfo?.config) : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });
  return (
    <div {...getRootProps()}>
      <div className='flex items-center justify-center'>
        {!isUploading ? (
          <PlusCircle className='md:h-10 md:w-10 h-5 w-5 text-zinc-950 md:text-zinc-700 hover:text-zinc-800 cursor-pointer hover:-translate-y-1 transition-all ' />
        ) : (
          <Progress
            value={progress}
            className='md:h-10 md:w-10 h-5 w-5 text-zinc-950 md:text-zinc-700 hover:text-zinc-800 cursor-pointer hover:-translate-y-1 transition-all animate-pulse'
          />
        )}
      </div>

      <input {...getInputProps()} disabled={isUploading} />
    </div>
  );
}
