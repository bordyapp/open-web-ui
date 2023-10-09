import axios from "axios";
import type {Card} from "@/BordieApi";

export interface ApiCallResult<T> {
    data?: T,
    httpStatusCode: number,
    errorMessage?: string
}

export class TasksApi {
    private readonly bordyHost: string;

    constructor(bordyHost: string) {
        this.bordyHost = bordyHost;
    }

    async getMyTasks(accessToken: string, workspaceId: string): Promise<ApiCallResult<Card[]>> {
        try {
            const { data, status} = await axios.get<Card[]>(
                `${this.bordyHost}/api/v1/gateway/workspaces/${workspaceId}/my-tasks`,
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