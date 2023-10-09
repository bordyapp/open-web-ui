import {defineStore} from 'pinia'
import type {WorkspaceElement} from "@/api/BoardsAndFoldersApi";
import {WorkspaceElementType} from "@/api/BoardsAndFoldersApi";

export class BoardBreadcrumb {
    id: string
    name: string
    type: WorkspaceElementType
    workspaceElement: WorkspaceElement | undefined

    constructor(id: string, name: string, type: WorkspaceElementType, workspaceElement: WorkspaceElement | undefined = undefined) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.workspaceElement = workspaceElement;
    }
}

export const useBoardBreadcrumbsStore = defineStore('boardBreadcrumbs', {
    state: () => ({
        breadcrumbs: Array<BoardBreadcrumb>(),
        selectedBreadcrumb: "" as String
    }),
    actions: {
        openSubBoard(subBoardId: string) {
            this.selectedBreadcrumb = subBoardId;
            this.breadcrumbs.push(new BoardBreadcrumb(
                subBoardId,
                subBoardId,
                WorkspaceElementType.Board,
                undefined
            ));
        },
        select(breadcrumb: BoardBreadcrumb) {
            this.selectedBreadcrumb = breadcrumb.id;

            let selectedBreadcrumbIndex = -1;
            this.breadcrumbs.forEach((element, index) => {
                if (breadcrumb.id === element.id) {
                    selectedBreadcrumbIndex = index;
                }
            });

            if (selectedBreadcrumbIndex !== -1) {
                this.breadcrumbs.splice(selectedBreadcrumbIndex + 1);
            }
        },
        sync(workspaceElement: WorkspaceElement) {
            this.selectedBreadcrumb = workspaceElement.id;
            this.breadcrumbs.forEach(element => {
                if (workspaceElement.id === element.id) {
                    element.name = workspaceElement.name;
                    element.workspaceElement = workspaceElement;
                }
            });

            // Page refresh
            if (this.breadcrumbs.length === 0) {
                this.breadcrumbs.push(new BoardBreadcrumb(
                    workspaceElement.id,
                    workspaceElement.name,
                    workspaceElement.type,
                    workspaceElement
                ));
            }
        },
        open(workspaceElement: WorkspaceElement) {
            this.selectedBreadcrumb = workspaceElement.id;
            if (workspaceElement.type === WorkspaceElementType.Folder) {
                this.breadcrumbs = [];
            }

            if (workspaceElement.type === WorkspaceElementType.Board
                && (workspaceElement.folderId === undefined || workspaceElement.folderId === null)
            ) {
                this.breadcrumbs = [];
            }

            let breadcrumb: BoardBreadcrumb | null = null;
            this.breadcrumbs.forEach((element, index) => {
                if (workspaceElement.id === element.id) {
                    breadcrumb = element;
                }
            });

            if (breadcrumb === null) {
                this.breadcrumbs.push(new BoardBreadcrumb(
                    workspaceElement.id,
                    workspaceElement.name,
                    workspaceElement.type,
                    workspaceElement
                ));
            }
        }
    }
});