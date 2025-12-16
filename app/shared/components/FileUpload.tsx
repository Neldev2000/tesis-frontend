import {
  forwardRef,
  useState,
  useRef,
  useCallback,
  type InputHTMLAttributes,
  type DragEvent,
  type ChangeEvent,
} from "react";

// 2025 Design: Clean file upload components
// - Muted slate palette
// - Smooth drag & drop interactions
// - React Hook Form compatible

type FileUploadSize = "sm" | "md" | "lg";

interface FileInfo {
  file: File;
  id: string;
  preview?: string;
  progress?: number;
  error?: string;
}

// ============================================================================
// FileUpload - Single or multiple file upload with drag & drop
// ============================================================================

interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange"> {
  label?: string;
  error?: string;
  hint?: string;
  /** Accepted file types (e.g., "image/*", ".pdf,.doc") */
  accept?: string;
  /** Allow multiple files */
  multiple?: boolean;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Current files */
  value?: File[];
  /** Called when files change */
  onChange?: (files: File[]) => void;
  /** Upload size variant */
  uploadSize?: FileUploadSize;
  /** Show file previews */
  showPreviews?: boolean;
  /** Compact inline mode */
  compact?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    );
  }
  if (type === "application/pdf") {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
};

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      error,
      hint,
      accept,
      multiple = false,
      maxSize,
      maxFiles,
      value = [],
      onChange,
      uploadSize = "md",
      showPreviews = true,
      compact = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileErrors, setFileErrors] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateFile = useCallback(
      (file: File): string | null => {
        if (maxSize && file.size > maxSize) {
          return `File "${file.name}" exceeds maximum size of ${formatFileSize(maxSize)}`;
        }
        if (accept) {
          const acceptedTypes = accept.split(",").map((t) => t.trim());
          const fileType = file.type;
          const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;

          const isAccepted = acceptedTypes.some((accepted) => {
            if (accepted.startsWith(".")) {
              return fileExtension === accepted.toLowerCase();
            }
            if (accepted.endsWith("/*")) {
              return fileType.startsWith(accepted.replace("/*", "/"));
            }
            return fileType === accepted;
          });

          if (!isAccepted) {
            return `File "${file.name}" is not an accepted file type`;
          }
        }
        return null;
      },
      [accept, maxSize]
    );

    const handleFiles = useCallback(
      (newFiles: FileList | File[]) => {
        const filesArray = Array.from(newFiles);
        const errors: string[] = [];
        const validFiles: File[] = [];

        // Check max files limit
        const remainingSlots = maxFiles ? maxFiles - value.length : Infinity;
        const filesToProcess = filesArray.slice(0, remainingSlots);

        if (filesArray.length > filesToProcess.length) {
          errors.push(`Maximum ${maxFiles} files allowed`);
        }

        filesToProcess.forEach((file) => {
          const fileError = validateFile(file);
          if (fileError) {
            errors.push(fileError);
          } else {
            validFiles.push(file);
          }
        });

        setFileErrors(errors);

        if (validFiles.length > 0) {
          if (multiple) {
            onChange?.([...value, ...validFiles]);
          } else {
            onChange?.(validFiles.slice(0, 1));
          }
        }
      },
      [multiple, value, onChange, maxFiles, validateFile]
    );

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
      (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files.length > 0) {
          handleFiles(files);
        }
      },
      [disabled, handleFiles]
    );

    const handleInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          handleFiles(files);
        }
        // Reset input value to allow selecting the same file again
        e.target.value = "";
      },
      [handleFiles]
    );

    const handleRemove = useCallback(
      (index: number) => {
        const newFiles = [...value];
        newFiles.splice(index, 1);
        onChange?.(newFiles);
        setFileErrors([]);
      },
      [value, onChange]
    );

    const handleClick = useCallback(() => {
      if (!disabled) {
        inputRef.current?.click();
      }
    }, [disabled]);

    // Combine refs
    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const sizeClasses = {
      sm: "py-4 px-4",
      md: "py-6 px-6",
      lg: "py-8 px-8",
    };

    if (compact) {
      return (
        <div className={`w-full ${className}`}>
          {label && (
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {label}
            </label>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClick}
              disabled={disabled}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5
                bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700
                hover:bg-slate-50 hover:border-slate-300
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              `}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              Choose file{multiple ? "s" : ""}
            </button>
            <span className="text-sm text-slate-500">
              {value.length === 0
                ? "No file selected"
                : value.length === 1
                  ? value[0].name
                  : `${value.length} files selected`}
            </span>
          </div>
          <input
            ref={setRefs}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            disabled={disabled}
            className="hidden"
            {...props}
          />
          {(error || fileErrors.length > 0 || hint) && (
            <p className={`mt-1.5 text-xs ${error || fileErrors.length > 0 ? "text-red-600" : "text-slate-500"}`}>
              {error || fileErrors[0] || hint}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}

        {/* Drop zone */}
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            ${sizeClasses[uploadSize]}
            border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center gap-2
            transition-all duration-150 cursor-pointer
            ${
              isDragging
                ? "border-slate-400 bg-slate-50"
                : error || fileErrors.length > 0
                  ? "border-red-300 bg-red-50/30"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <div className={`rounded-full p-2 ${isDragging ? "bg-slate-200" : "bg-slate-100"}`}>
            <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">
              {isDragging ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              or <span className="text-slate-700 underline underline-offset-2">browse</span>
            </p>
          </div>
          {(accept || maxSize) && (
            <p className="text-xs text-slate-400 mt-1">
              {accept && `Accepted: ${accept}`}
              {accept && maxSize && " • "}
              {maxSize && `Max size: ${formatFileSize(maxSize)}`}
            </p>
          )}
        </div>

        <input
          ref={setRefs}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
          {...props}
        />

        {/* Error messages */}
        {(error || fileErrors.length > 0) && (
          <div className="mt-2 space-y-1">
            {error && <p className="text-xs text-red-600">{error}</p>}
            {fileErrors.map((err, index) => (
              <p key={index} className="text-xs text-red-600">{err}</p>
            ))}
          </div>
        )}

        {/* Hint */}
        {hint && !error && fileErrors.length === 0 && (
          <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
        )}

        {/* File list */}
        {showPreviews && value.length > 0 && (
          <ul className="mt-3 space-y-2">
            {value.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg"
              >
                {/* Preview or icon */}
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center text-slate-500">
                    {getFileIcon(file.type)}
                  </div>
                )}

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

// ============================================================================
// ImageUpload - Specialized for images with preview
// ============================================================================

interface ImageUploadProps extends Omit<FileUploadProps, "accept" | "showPreviews"> {
  /** Aspect ratio for preview (e.g., "1/1", "16/9") */
  aspectRatio?: string;
  /** Show circular preview */
  circular?: boolean;
}

export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  (
    {
      label,
      error,
      hint,
      value = [],
      onChange,
      multiple = false,
      maxSize = 5 * 1024 * 1024, // 5MB default
      aspectRatio = "1/1",
      circular = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
      (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;

        const files = Array.from(e.dataTransfer.files).filter((f) =>
          f.type.startsWith("image/")
        );
        if (files.length > 0) {
          onChange?.(multiple ? [...value, ...files] : files.slice(0, 1));
        }
      },
      [disabled, multiple, value, onChange]
    );

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          const imageFiles = Array.from(files);
          onChange?.(multiple ? [...value, ...imageFiles] : imageFiles.slice(0, 1));
        }
        e.target.value = "";
      },
      [multiple, value, onChange]
    );

    const handleRemove = useCallback(
      (index: number) => {
        const newFiles = [...value];
        newFiles.splice(index, 1);
        onChange?.(newFiles);
      },
      [value, onChange]
    );

    const handleClick = useCallback(() => {
      if (!disabled) inputRef.current?.click();
    }, [disabled]);

    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const previewUrl = value.length > 0 ? URL.createObjectURL(value[0]) : null;

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}

        {!multiple && value.length > 0 && previewUrl ? (
          // Single image preview
          <div className="relative group">
            <div
              className={`
                overflow-hidden bg-slate-100
                ${circular ? "rounded-full" : "rounded-lg"}
              `}
              style={{ aspectRatio }}
            >
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className={`
                absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity
                flex items-center justify-center gap-2
                ${circular ? "rounded-full" : "rounded-lg"}
              `}
            >
              <button
                type="button"
                onClick={handleClick}
                className="p-2 bg-white rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleRemove(0)}
                className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          // Upload zone
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-6
              flex flex-col items-center justify-center gap-2
              transition-all duration-150 cursor-pointer
              ${circular ? "rounded-full aspect-square" : ""}
              ${
                isDragging
                  ? "border-slate-400 bg-slate-50"
                  : error
                    ? "border-red-300 bg-red-50/30"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
            style={!circular ? { aspectRatio } : undefined}
          >
            <div className="rounded-full p-2 bg-slate-100">
              <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
            <p className="text-sm text-slate-600">Upload image</p>
            {maxSize && (
              <p className="text-xs text-slate-400">Max {formatFileSize(maxSize)}</p>
            )}
          </div>
        )}

        <input
          ref={setRefs}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
          {...props}
        />

        {/* Multiple images preview */}
        {multiple && value.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {value.map((file, index) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);

ImageUpload.displayName = "ImageUpload";

// ============================================================================
// AvatarUpload - Specialized circular avatar upload
// ============================================================================

interface AvatarUploadProps {
  label?: string;
  error?: string;
  hint?: string;
  value?: File | string;
  onChange?: (file: File | undefined) => void;
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  className?: string;
}

const avatarSizes = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-40 h-40",
};

export const AvatarUpload = forwardRef<HTMLInputElement, AvatarUploadProps>(
  (
    {
      label,
      error,
      hint,
      value,
      onChange,
      size = "lg",
      disabled,
      className = "",
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const previewUrl = value
      ? typeof value === "string"
        ? value
        : URL.createObjectURL(value)
      : null;

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
          onChange?.(file);
        }
        e.target.value = "";
      },
      [onChange]
    );

    const handleClick = useCallback(() => {
      if (!disabled) inputRef.current?.click();
    }, [disabled]);

    const handleRemove = useCallback(() => {
      onChange?.(undefined);
    }, [onChange]);

    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
          </label>
        )}

        <div className="relative group">
          <div
            onClick={handleClick}
            className={`
              ${avatarSizes[size]}
              rounded-full overflow-hidden
              flex items-center justify-center
              border-2 border-dashed
              transition-all duration-150 cursor-pointer
              ${
                previewUrl
                  ? "border-transparent"
                  : error
                    ? "border-red-300 bg-red-50/30"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            )}
          </div>

          {/* Hover overlay for existing avatar */}
          {previewUrl && !disabled && (
            <div
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1"
            >
              <button
                type="button"
                onClick={handleClick}
                className="p-1.5 bg-white rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <input
          ref={setRefs}
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);

AvatarUpload.displayName = "AvatarUpload";
