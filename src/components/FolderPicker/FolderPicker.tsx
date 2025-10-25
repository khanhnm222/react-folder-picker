import React from "react";
import "./FolderPicker.css";
import { FolderNameInput } from "../FolderNameInput/FolderNameInput";
import { FolderActions } from "../FolderActions/FolderActions";

export interface FolderNode {
  id: string;
  name: string;
  hasSubFolder?: boolean;
  children?: FolderNode[];
}

interface FolderPickerProps {
  folders: FolderNode[];
  selectedId?: string;
  loading?: boolean;
  editingId?: string;
  expandedIds?: string[];
  onSelect?: (id: string) => void;
  onExpand?: (id: string) => void;
  onAddFolder?: (parentId?: string) => void;
  onRenameFolder?: (id: string) => void;
  onSaveFolderName?: (id: string, name: string) => void;
  onCancelEdit?: () => void;
}

const FolderPicker: React.FC<FolderPickerProps> = ({
  folders,
  selectedId,
  loading = false,
  editingId,
  expandedIds = [],
  onSelect,
  onExpand,
  onAddFolder,
  onRenameFolder,
  onSaveFolderName,
  onCancelEdit,
}) => {
  const renderNode = (node: FolderNode, depth = 0) => {
    const isExpanded = expandedIds.includes(node.id);
    const isSelected = selectedId === node.id;
    const isEditing = editingId === node.id;

    return (
      <div key={node.id} className="folder-node-wrapper">
        <div
          className={`folder-node ${isSelected ? "selected" : ""}`}
          style={{ paddingLeft: `${depth * 16}px` }}
          onClick={() => onSelect?.(node.id)}
        >
          {node.hasSubFolder ? (
            <div
              className="expand-icon"
              onClick={(e) => {
                e.stopPropagation();
                onExpand?.(node.id);
              }}
            >
              {loading && node.id === selectedId ? (
                <div className="spinner small" />
              ) : (
                <span className="icon">{isExpanded ? "▼" : "▶"}</span>
              )}
            </div>
          ) : (
            <div className="node-space" />
          )}

          <span className="folder-icon">📁</span>

          {isEditing ? (
            <FolderNameInput
              initialName={node.name}
              onSave={(newName) => onSaveFolderName?.(node.id, newName)}
              onCancel={onCancelEdit ?? (() => {})}
            />
          ) : (
            <span className="folder-name">{node.name}</span>
          )}

          <FolderActions
            folderId={node.id}
            onAddNewFolder={() => onAddFolder?.(node.id)}
            onRenameFolder={() => onRenameFolder?.(node.id)}
          />
        </div>

        {isExpanded && node.children && (
          <div className="folder-children">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="folder-picker">
      {folders.map((folder) => renderNode(folder))}

      {loading && (
        <div className="folder-loading">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};
