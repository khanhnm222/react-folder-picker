export interface TFolderAction {

}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
}

export type FolderData = Folder[];

export enum FolderActionType {
  ADD_NEW = "ADD_NEW",
  RENAME = "RENAME",
}