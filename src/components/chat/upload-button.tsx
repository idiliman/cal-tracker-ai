'use client';

import { PlusCircle } from 'lucide-react';
import { Progress } from '../ui/progress';

import { useCallback, useState } from 'react';
import { useDropzone } from '@uploadthing/react';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { useUploadThing } from '@/utils/uploadthing';
import { sleep } from '@/lib/utils';

interface Props {
  onUploaded: (url: string) => void;
}

export default function UploadButton({ onUploaded }: Props) {
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
      startUpload(acceptedFiles);
    },
    [startUpload]
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
          <PlusCircle className='md:h-10 md:w-10 h-10 w-10 text-zinc-700 hover:text-zinc-800 cursor-pointer hover:-translate-y-1 transition-all active:translate-y-0' />
        ) : (
          <Progress
            value={progress}
            className='md:h-10 md:w-10 h-10 w-10 text-zinc-700 hover:text-zinc-800 cursor-pointer hover:-translate-y-1 transition-all active:translate-y-0'
          />
        )}
      </div>

      <input {...getInputProps()} disabled={isUploading} />
    </div>
  );
}
