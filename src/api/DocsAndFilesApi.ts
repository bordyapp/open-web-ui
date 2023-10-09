import axios from "axios";

export class File {
    id: string
    name: string
    workspaceId: string
    folderId: string
    type: FileType
    url: string
    creatorUserId: string
    createdAt: Date
    editedAt: Date

    constructor(
        id: string,
        name: string,
        workspaceId: string,
        folderId: string,
        type: FileType,
        url: string,
        creatorUserId: string,
        createdAt: Date,
        editedAt: Date
    ) {
        this.id = id;
        this.name = name;
        this.workspaceId = workspaceId;
        this.folderId = folderId;
        this.type = type;
        this.url = url;
        this.creatorUserId = creatorUserId;
        this.createdAt = createdAt;
        this.editedAt = editedAt;
    }
}

export enum FileType {
    FILE = "file",
    FOLDER = "folder",
    EXTERNAL_FILE = "external_file"
}

export class WriteFileDto {
    public name: string
    public type: FileType
    public url: string

    constructor(name: string, type: FileType, url: string) {
        this.name = name;
        this.type = type;
        this.url = url;
    }
}
export class UpdateFileDto {
    public name: string
    public url: string

    constructor(name: string, url: string) {
        this.name = name;
        this.url = url;
    }
}

export interface ApiCallResult<T> {
    data?: T,
    httpStatusCode: number,
    errorMessage?: string
}

export class DocsAndFilesApi {
    private readonly bordyHost: string;

    constructor(bordyHost: string) {
        this.bordyHost = bordyHost;
    }

    async getWorkspaceFiles(accessToken: string, workspaceId: string): Promise<ApiCallResult<File[]>> {
        try {
            const { data, status} = await axios.get<File[]>(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/files`,
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

    async createWorkspaceFile(accessToken: string, workspaceId: string, request: WriteFileDto): Promise<ApiCallResult<File>> {
        try {
            const { data, status} = await axios.post<File>(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/files`,
                request,
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

    async updateWorkspaceFile(accessToken: string, workspaceId: string, fileId: string, request: UpdateFileDto): Promise<ApiCallResult<File>> {
        try {
            const { data, status} = await axios.put<File>(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/files/${fileId}`,
                request,
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

    async deleteWorkspaceFile(accessToken: string, workspaceId: string, fileId: string): Promise<ApiCallResult<void>> {
        try {
            const { status} = await axios.delete(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/files/${fileId}`,
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

    private returnError(error): ApiCallResult<any> {
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