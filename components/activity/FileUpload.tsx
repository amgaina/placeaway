import { Activity, Attachment } from '@prisma/client';
import Image from 'next/image';
import { useState } from 'react';

export const FileUpload: React.FC<{
  activity: Activity & { attachments: Attachment[] };
  onUpload: (files: File[]) => void;
}> = ({ activity, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 text-center ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        onUpload(Array.from(e.dataTransfer.files));
      }}
    >
      <input
        type="file"
        multiple
        className="hidden"
        onChange={(e) => onUpload(Array.from(e.target.files || []))}
        id={`file-${activity.id}`}
      />
      <label
        htmlFor={`file-${activity.id}`}
        className="cursor-pointer text-blue-500 hover:text-blue-600"
      >
        Click to upload
      </label>
      <span className="text-gray-500"> or drag and drop</span>

      {activity?.attachments?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {activity.attachments.map((file, i) => (
            <div key={i} className="relative w-16 h-16">
              <Image
                src={file.url}
                alt={file.filename}
                fill
                className="object-cover rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
