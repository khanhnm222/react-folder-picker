import React from "react";
import "./FolderPicker.css";
import { FolderNameInput } from "../FolderNameInput/FolderNameInput";
import { FolderActions } from "../FolderActions/FolderActions";
import IconFolder from "../../icons/IconFolder";
import IconArrowDown from "../../icons/IconArrowDown";
import IconArrowRight from "../../icons/IconArrowRight";

export interface FolderNode {
  id: string;
  name: string;
  hasSubFolder?: boolean;
  children?: FolderNode[];
}

interface FolderPickerProps {
  /**
   * List of folder nodes to display
   */
  folders: FolderNode[];
  /**
   * Currently selected folder ID
  */
  selectedId?: string;
  /**
   * Loading state indicator
   * @default false
   */
  loading?: boolean;
  /**
   * Currently editing folder ID
   */
  editingId?: string;
  /**
   * List of expanded folder IDs
   * @default []
   */
  expandedIds?: string[];
  /**
   * Callback when a folder is selected
   */
  onSelect?: (id: string) => void;
  /**
   * Callback when a folder is expanded/collapsed
   */
  onExpand?: (id: string) => void;
  /**
   * Callback to add a new folder
   */
  onAddFolder?: (parentId?: string) => void;
  /**
   * Callback to rename a folder
   */
  onRenameFolder?: (id: string) => void;
  /**
   * Callback to save the new folder name
   */
  onSaveFolderName?: (id: string, name: string) => void;
  /**
   * Callback to cancel editing
   */
  onCancelEdit?: () => void;
}

export const FolderPicker: React.FC<FolderPickerProps> = ({
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
                <span className="icon">{isExpanded ? <IconArrowDown /> : <IconArrowRight />}</span>
              )}
            </div>
          ) : (
            <div className="node-space" />
          )}

          <span className="folder-icon"><IconFolder /></span>

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
