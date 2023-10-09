import axios from "axios";

export type Workspace = {
    // UUID
    id: string;
    name: string;
    photo: string;
    // UUID
    ownerId: string;
    members: WorkspaceMember[];
    invites: string;
    createdAt:Date;
    editedAt:Date;
}

export class WorkspaceMember {
    // UUID
    public id:String
    public email:String
    public nickname:String
    public role:String
    public responsibilities:String
    public picture:String

    constructor(id: string, email: string, nickname: string, role: string, responsibilities: string, picture: string) {
        this.id = id;
        this.email = email;
        this.nickname = nickname;
        this.role = role;
        this.responsibilities = responsibilities;
        this.picture = picture;
    }

}

export class WorkspaceInvite {
    // UUID
    id: String
    // UUID
    workspaceId: String
    email: String
    role: String
    status: WorkspaceInviteStatus
    createdAt:Date
}

export enum WorkspaceInviteStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED"
}

export interface ApiCallResult<T> {
    data?: T,
    httpStatusCode: number,
    errorMessage?: string
}

export class UpdateMemberDto {
    name: string
    role: string
    responsibilities: string

    constructor(name: string, role: string, responsibilities: string) {
        this.name = name
        this.role = role
        this.responsibilities = responsibilities
    }
}

export class CreateInviteDto {
    email: string
    name: string
    role: string
    responsibilities: string

    constructor(email: string, name: string, role: string, responsibilities: string) {
        this.email = email
        this.name = name
        this.role = role
        this.responsibilities = responsibilities
    }
}

export class WorkspacesApi {
    private readonly bordyHost: string;

    constructor(endpoint: string) {
        this.bordyHost = endpoint;
    }

    async getWorkspaces(accessToken: string): Promise<[Workspace[], number, string | null]> {
        try {
            const { data, status } = await axios.get<Workspace[]>(
                `${this.bordyHost}/api/v1/gateway/workspaces`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            return [data, status, null];
        } catch(error) {
            if (axios.isAxiosError(error)) {
                console.log('getWorkspaces - error message: ', error.message);
                return [[], 400, error.message];
            } else {
                let message = 'Unknown Error'
                if (error instanceof Error) {
                    message = error.message
                }
                console.log('getWorkspaces - unexpected error: ', message);
                return [[], 400, message];
            }
        }
    }

    async getWorkspace(accessToken: string, workspaceId: string): Promise<[Workspace | null, number, string | null]> {
        try {
            const { data, status } = await axios.get<Workspace>(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            return [data, status, null];
        } catch(error) {
            if (axios.isAxiosError(error)) {
                console.log('getWorkspaces - error message: ', error.message);
                return [null, 400, error.message];
            } else {
                let message = 'Unknown Error'
                if (error instanceof Error) {
                    message = error.message
                }
                console.log('getWorkspaces - unexpected error: ', message);
                return [null, 400, message];
            }
        }
    }

    async uploadWorkspacePhoto(accessToken: string, workspaceId: string, file: File): Promise<[number, string | null]> {
        try {
            let formData = new FormData();
            formData.append("workspacePhoto", file, file.name);

            const { status } = await axios.post(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/upload-photo`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            return [status, null];
        } catch(error) {
            if (axios.isAxiosError(error)) {
                console.log('getWorkspaces - error message: ', error.message);
                return [400, error.message];
            } else {
                let message = 'Unknown Error'
                if (error instanceof Error) {
                    message = error.message
                }
                console.log('getWorkspaces - unexpected error: ', message);
                return [400, message];
            }
        }
    }

    async renameWorkspace(accessToken: string, workspaceId: string, name: string): Promise<[number, string | null]> {
        try {
            const {status} = await axios.post(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/rename`,
                {
                    name: name
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            return [status, null];
        } catch(error) {
            if (axios.isAxiosError(error)) {
                console.log('getWorkspaces - error message: ', error.message);
                return [400, error.message];
            } else {
                let message = 'Unknown Error'
                if (error instanceof Error) {
                    message = error.message
                }
                console.log('getWorkspaces - unexpected error: ', message);
                return [400, message];
            }
        }
    }

    async deleteWorkspace(accessToken: string, workspaceId: string) {
        try {
            const {status} = await axios.delete(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            return [status, null];
        } catch(error) {
            if (axios.isAxiosError(error)) {
                console.log('getWorkspaces - error message: ', error.message);
                return [400, error.message];
            } else {
                let message = 'Unknown Error'
                if (error instanceof Error) {
                    message = error.message
                }
                console.log('getWorkspaces - unexpected error: ', message);
                return [400, message];
            }
        }
    }

    async createInvite(accessToken: string, workspaceId: string, request: CreateInviteDto): Promise<ApiCallResult<WorkspaceInvite>> {
        try {
            const { data, status} = await axios.post<WorkspaceInvite>(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/invites`,
                request,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
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

    async deleteInvite(accessToken: string, workspaceId: string, inviteId: string): Promise<ApiCallResult<void>> {
        try {
            const { data, status} = await axios.delete(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/invites/${inviteId}`,
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

    async updateMember(accessToken: string, workspaceId: string, memberId: string, request: UpdateMemberDto): Promise<ApiCallResult<WorkspaceMember>> {
        try {
            const { data, status} = await axios.put<WorkspaceMember>(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/members/${memberId}`,
                request,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
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

    async deleteMember(accessToken: string, workspaceId: string, memberId: string): Promise<ApiCallResult<void>> {
        try {
            const { data, status} = await axios.delete(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/members/${memberId}`,
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