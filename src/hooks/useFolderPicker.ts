import { useCallback, useState } from "react";

export interface FolderNode {
  id: string;
  name: string;
  hasSubFolder?: boolean;
  children?: FolderNode[];
}

export interface FolderData {
  rootId: string;
  nodes: Record<string, FolderNode>;
}

export interface FolderValue {
  id: string;
}

export type ActionedFolder = {
  id: string;
  action: "ADD_NEW" | "RENAME";
};

interface UseFolderPickerProps {
  data: FolderData;
  defaultValue?: FolderValue;
  allowAddNewFolder?: boolean;
  actionedFolder?: ActionedFolder | null;
  handleCreateNewFolder: (
    parentFolderId: string,
    folderName: string,
    callback: (isSuccess: boolean, folder: FolderNode | null) => void
  ) => void;
  handleRenameFolder?: (
    folderId: string,
    folderName: string,
    callback: (isSuccess: boolean) => void
  ) => void;
  getSubFolders: (parentId: string) => Promise<FolderNode[]>;
  getParentFolders: (parentId: string) => Promise<FolderData>;
  onChange?: (value: FolderValue) => void;
}

export const useFolderPicker = ({
  data,
  defaultValue,
  allowAddNewFolder,
  actionedFolder,
  handleCreateNewFolder,
  handleRenameFolder,
  getParentFolders,
  getSubFolders,
  onChange,
}: UseFolderPickerProps) => {
  const [treeData, setTreeData] = useState<FolderNode[]>([
    data.nodes[data.rootId],
  ]);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState(defaultValue?.id || "");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNewChildFolders, setAddingNewChildFolders] = useState<
    Set<string>
  >(new Set());

  /** chọn folder */
  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      onChange?.({ id });
    },
    [onChange]
  );

  /** mở rộng folder */
  const handleExpand = useCallback(
    async (id: string) => {
      if (expandedIds.includes(id)) {
        setExpandedIds(expandedIds.filter((x) => x !== id));
        return;
      }

      setLoadingIds((prev) => new Set(prev).add(id));
      try {
        const children = await getSubFolders(id);
        setTreeData((prev) =>
          prev.map((node) =>
            node.id === id ? { ...node, children } : node
          )
        );
        setExpandedIds((prev) => [...prev, id]);
      } finally {
        setLoadingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [expandedIds, getSubFolders]
  );

  /** thêm folder mới */
  const handleAddFolder = useCallback((parentId?: string) => {
    if (!parentId) return;
    setAddingNewChildFolders((prev) => new Set(prev).add(parentId));
  }, []);

  /** hủy thêm folder */
  const handleDiscardInput = useCallback((parentId: string) => {
    setAddingNewChildFolders((prev) => {
      const next = new Set(prev);
      next.delete(parentId);
      return next;
    });
  }, []);

  /** rename folder */
  const handleRename = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  /** save input (add hoặc rename) */
  const handleSaveInput = useCallback(
    (
      folderId: string | null,
      parentFolderId: string,
      folderName: string,
      action: "ADD_NEW" | "RENAME",
      callback: (isSuccess: boolean) => void
    ) => {
      if (action === "ADD_NEW") {
        handleCreateNewFolder(parentFolderId, folderName, (ok, newFolder) => {
          if (ok && newFolder) {
            setTreeData((prev) =>
              prev.map((n) =>
                n.id === parentFolderId
                  ? { ...n, children: [...(n.children || []), newFolder] }
                  : n
              )
            );
          }
          handleDiscardInput(parentFolderId);
          callback(ok);
        });
      }

      if (action === "RENAME" && folderId && handleRenameFolder) {
        handleRenameFolder(folderId, folderName, (ok) => {
          if (ok) {
            setTreeData((prev) =>
              prev.map((n) =>
                n.id === folderId ? { ...n, name: folderName } : n
              )
            );
          }
          setEditingId(null);
          callback(ok);
        });
      }
    },
    [handleCreateNewFolder, handleRenameFolder, handleDiscardInput]
  );

  return {
    treeData,
    loadingIds,
    expandedIds,
    selectedId,
    editingId,
    addingNewChildFolders,
    handleSelect,
    handleExpand,
    handleAddFolder,
    handleRename,
    handleDiscardInput,
    handleSaveInput,
  };
};
