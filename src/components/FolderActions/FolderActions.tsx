import { useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useConditionalRender } from '../../hooks/useConditionalRender';
import { FolderActionType, type TFolderAction } from '../../types';
import './FolderPicker.css';

interface FolderActionsProps {
  folderId?: string;
  isDisabled?: boolean;
  onAddNewFolder?: (folderId: string) => void;
  onRenameFolder?: (folderId: string) => void;
}

export const FolderActions = ({
  folderId,
  isDisabled = false,
  onAddNewFolder,
  onRenameFolder,
}: FolderActionsProps) => {
  const {
    shouldRender: renderActionList,
    show: showPopup,
    hide: hidePopup,
  } = useConditionalRender(false);

  const componentRef = useRef<HTMLDivElement>(null);
  useClickOutside(componentRef, () => hidePopup);

  const handleSelectOption = (actionType: TFolderAction) => {
    if (actionType === FolderActionType.ADD_NEW) {
      onAddNewFolder?.(folderId as any);
    } else if (actionType === FolderActionType.RENAME) {
      onRenameFolder?.(folderId as any);
    }
    hidePopup();
  };

  return (
    <div className='folder-actions-dropdown'>
      <button
        type='button'
        className='icon-button'
        disabled={isDisabled}
        onClick={(e) => {
          e.stopPropagation();
          showPopup();
        }}
      >
        ⋮
      </button>

      {renderActionList && (
        <div
          className='folder-actions-menu'
          onClick={(e) => e.stopPropagation()}
          ref={componentRef}
        >
          <div
            className='folder-action-item'
            onClick={() => handleSelectOption(FolderActionType.ADD_NEW)}
          >
            <span className='icon'>＋</span>
            <span>Add new</span>
          </div>
          <div
            className='folder-action-item'
            onClick={() => handleSelectOption(FolderActionType.RENAME)}
          >
            <span className='icon'>✎</span>
            <span>Rename</span>
          </div>
        </div>
      )}
    </div>
  );
};
