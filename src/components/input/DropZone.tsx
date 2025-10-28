import cn from "@/utils/cn";
import React, { useState } from "react";
import { IoTrash } from "react-icons/io5";

type Props = {
  icon: any;
  label?: string;
  fileType: string;
  file: File | null;
  className?: string;
  classNames?: {
    container?: string;
    input?: string;
    button?: string;
  };
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};

const DropZone: React.FC<Props> = (props) => {
  const [isDrag, setIsDrag] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDrag(false);
    const droppedFiles = event.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      props.setFile(droppedFiles[0]);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      props.setFile(selectedFiles[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDrag(true);
  };
  const handledragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDrag(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col space-y-2 w-full aspect-video",
        props.className
      )}
    >
      <span className="text-foreground">{props.label}</span>
      <div
        className={cn(
          "group flex items-center p-4 border-2 border-strokedark hover:border-primary border-dashed rounded-lg w-full min-w-lg h-full duration-300 cursor-pointer",
          props.classNames?.container
        )}
        onDragOver={handleDragOver}
        onDragLeave={handledragLeave}
        onDrop={handleDrop}
      >
        {props.file ? (
          <div className="relative flex flex-col justify-center items-center group-hover:border-divider rounded w-full h-32 object-cover text-gray-400 group-hover:text-white text-xs duration-300 cursor-pointer">
            <IoTrash
              className="-top-12 -right-3 absolute bg-content1 hover:bg-background p-2 border border-divider rounded-full w-10 h-10 text-white duration-300 cursor-pointer"
              onClick={() => props.setFile(null)}
            />
            <span className="w-32 text-center truncate">{props.file.name}</span>
          </div>
        ) : (
          <label
            htmlFor="video"
            className="flex flex-col justify-center items-center space-y-1 group-hover:border-divider rounded w-full h-32 text-gray-400 text-xs duration-300 cursor-pointer"
          >
            <input
              type="file"
              id="video"
              name="video"
              accept={`${
                props.fileType === "csv" ? ".csv" : props.fileType + "/*"
              }`}
              hidden
              onChange={handleFileSelect}
            />
            <props.icon className="w-20 h-20" />
            <span>
              {isDrag
                ? `Drop your ${props.fileType} here`
                : `Drag and drop your ${props.fileType} here or select ${props.fileType}`}
            </span>
          </label>
        )}
      </div>
    </div>
  );
};

export default DropZone;
