import axios from "axios";
import type {List} from "@/BordieApi";

export class WorkspaceElement {
    // UUID
    id: string
    name: string
    // UUID
    workspaceId: string
    // UUID
    folderId: string
    type: WorkspaceElementType
    sharing: WorkspaceElementSharing
    boards: WorkspaceElement[]
    lists: List[]
    createdAt: Date
    editedAt: Date

    constructor(
        id: string,
        name: string,
        workspaceId: string,
        folderId: string,
        type: WorkspaceElementType,
        sharing: WorkspaceElementSharing,
        boards: WorkspaceElement[],
        lists: List[],
        createdAt: Date,
        editedAt: Date
    ) {
        this.id = id;
        this.name = name;
        this.workspaceId = workspaceId;
        this.folderId = folderId;
        this.type = type;
        this.sharing = sharing;
        this.boards = boards;
        this.lists = lists;
        this.createdAt = createdAt;
        this.editedAt = editedAt;
    }

}

export class WorkspaceElementSharing {
    id: string
    isActive: boolean

    constructor(id: string, isActive: boolean) {
        this.id = id;
        this.isActive = isActive;
    }

}

export enum WorkspaceElementType {
    Folder = "folder",
    Board = "board"
}

export interface ApiCallResult<T> {
    data?: T,
    httpStatusCode: number,
    errorMessage?: string
}

export class BoardsAndFoldersApi {
    private readonly bordyHost: string;

    constructor(bordyHost: string) {
        this.bordyHost = bordyHost;
    }

    async getBoardsAndFolders(accessToken: string, workspaceId: string): Promise<ApiCallResult<WorkspaceElement[]>> {
        try {
            const { data, status} = await axios.get<WorkspaceElement[]>(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/elements`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            return {
                data: data,
                httpStatusCode: status,
            };
        } catch(error) {
            return this.returnError(error);
        }
    }

    async getBoardOrFolder(accessToken: string, workspaceId: string, boardOrFolderId: string): Promise<ApiCallResult<WorkspaceElement>> {
        try {
            const { data, status} = await axios.get<WorkspaceElement>(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/elements/${boardOrFolderId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            return {
                data: data,
                httpStatusCode: status,
            };
        } catch(error) {
            return this.returnError(error);
        }
    }

    async createBoardOrFolder(
        accessToken: string,
        workspaceId: string,
        name: string,
        folderId: undefined | string,
        type: WorkspaceElementType
    ): Promise<ApiCallResult<WorkspaceElement>> {
        try {
            const {data, status} = await axios.post<WorkspaceElement>(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/elements`,
                {
                    name: name,
                    type: type,
                    folderId: folderId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            return {
                data: data,
                httpStatusCode: status,
            };
        } catch(error) {
            return this.returnError(error);
        }
    }

    async renameBoardOrFolder(
        accessToken: string,
        workspaceId: string,
        boardOrFolderId: string,
        name: string
    ): Promise<ApiCallResult<void>> {
        try {
            const {status} = await axios.post<void>(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/elements/${boardOrFolderId}/rename`,
                {
                    name: name,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            return {
                httpStatusCode: status,
            };
        } catch(error) {
            return this.returnError(error);
        }
    }

    async deleteBoardOrFolder(accessToken: string, workspaceId: string, boardOrFolderId: string): Promise<ApiCallResult<void>> {
        try {
            const {status} = await axios.delete<void>(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/elements/${boardOrFolderId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            return {
                httpStatusCode: status,
            };
        } catch(error) {
            return this.returnError(error);
        }
    }

    async addBoardToFolder(
        accessToken: string,
        workspaceId: string,
        boardId: string,
        folderId: string
    ): Promise<ApiCallResult<void>> {
        try {
            const {status} = await axios.post<void>(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/elements/${boardId}/add-to-folder`,
                {
                    folderId: folderId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            return {
                httpStatusCode: status,
            };
        } catch(error) {
            return this.returnError(error);
        }
    }

    async removeBoardFromFolder(
        accessToken: string,
        workspaceId: string,
        boardId: string
    ): Promise<ApiCallResult<void>> {
        try {
            const {status} = await axios.post<void>(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/elements/${boardId}/remove-from-folder`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            return {
                httpStatusCode: status,
            };
        } catch(error) {
            return this.returnError(error);
        }
    }

    private returnError(error: any): ApiCallResult<any> {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return {
                httpStatusCode: 400,
                errorMessage: error.message
            };
        } else {
            let message = 'Unknown Error'
            if (error instanceof Error) {
                message = error.message
            }
            console.log('unexpected error: ', message);
            return {
                httpStatusCode: 400,
                errorMessage: message
            };
        }
    }
}