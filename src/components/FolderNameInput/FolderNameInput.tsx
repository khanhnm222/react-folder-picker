import { useState, useEffect } from "react";
import './FolderNameInput.css';

interface FolderNameInputProps {
  initialName?: string;
  autoFocus?: boolean;
  placeholder?: string;
  onSave: (newName: string) => void;
  onCancel: () => void;
}

export const FolderNameInput = ({
  initialName = "",
  autoFocus = true,
  placeholder = "Enter folder name",
  onSave,
  onCancel,
}: FolderNameInputProps) => {
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (autoFocus) {
      const input = document.querySelector<HTMLInputElement>(
        ".folder-name-input input"
      );
      input?.focus();
    }
  }, [autoFocus]);

  const handleSave = () => {
    if (!name.trim()) return;
    setIsSaving(true);
    setTimeout(() => {
      onSave(name.trim());
      setIsSaving(false);
    }, 600); // giả lập saving
  };

  return (
    <div className="folder-name-input">
      <input
        type="text"
        value={name}
        placeholder={placeholder}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") onCancel();
        }}
      />

      <div className="folder-name-actions">
        {isSaving ? (
          <div className="spinner small"></div>
        ) : (
          <>
            <button className="btn save" onClick={handleSave}>
              Save
            </button>
            <button className="btn cancel" onClick={onCancel}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};
