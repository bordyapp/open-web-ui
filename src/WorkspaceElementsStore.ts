import { defineStore } from 'pinia'
import {ref} from "vue";
import {BordyApi} from "@/api/BordyApi";
import {WorkspaceElement, WorkspaceElementType} from "@/api/BoardsAndFoldersApi"
import type {ApiCallResult} from "@/api/BoardsAndFoldersApi"

export const useWorkspaceElementsStore = defineStore('workspace-elements', {
    state: () => (
        {
            isLoading: ref<boolean>(false),
            isLoadingError: ref<boolean>(false),
            workspaceElements: ref<WorkspaceElement[]>([]),
        }
    ),
    getters: {
        loadedWithoutErrors(): boolean {
            return this.isLoading === false && this.isLoadingError === false;
        },
        loadedWithErrors(): boolean {
            return this.isLoading === false && this.isLoadingError === true;
        }
    },
    actions: {
        async loadWorkspaceElements(accessToken: string, workspaceId: string) {
            this.isLoading = true;
            this.isLoadingError = false;

            const apiCallResult: ApiCallResult<WorkspaceElement[]> = await BordyApi.BoardsAndFolders.getBoardsAndFolders(
                accessToken, workspaceId
            );
            this.isLoading = false;

            if (apiCallResult.httpStatusCode !== 200) {
                this.isLoadingError = true;
            } else {
                this.workspaceElements = apiCallResult.data || [];
            }
        },
        addWorkspaceElement(workspaceElement: WorkspaceElement) {
            this.workspaceElements.push(workspaceElement)
        },
        addBoardToFolder(folderId: string, workspaceElement: WorkspaceElement) {
            this.workspaceElements.forEach(folder => {
                if (folder.type == WorkspaceElementType.Folder && folder.id == folderId) {
                    folder.boards?.push(workspaceElement)
                }
            })
        },
        removeBoardFromFolder(folderId: string, boardIndex: number) {
            this.workspaceElements.forEach(folder => {
                if (folder.type == WorkspaceElementType.Folder && folder.id == folderId) {
                    folder.boards?.splice(boardIndex, 1)
                }
            })
        },
        replaceSelf(workspaceElement: WorkspaceElement) {
            let selfIndex = -1;
            this.workspaceElements.forEach((element, index) => {
                if (element.id === workspaceElement.id) {
                    selfIndex = index;
                }
            })
            if (selfIndex != -1) {
                this.workspaceElements[selfIndex] = workspaceElement;
            }
        },
        removeWorkspaceElement(workspaceElementIndex: number) {
            this.workspaceElements.splice(workspaceElementIndex, 1);
        },
        findWorkspaceElement(id: string): WorkspaceElement | null  {
            let result = null;
            this.workspaceElements.forEach((element, index) => {
                if (element.id === id) {
                    result = element;
                }
            })

            return result;
        }
    },
})