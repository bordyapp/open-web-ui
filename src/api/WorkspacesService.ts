import {BordyApi} from "./BordyApi";

import type {Workspace} from "@/api/WorkspacesApi";

export class WorkspacesService {

    static async loadWorkspaces(accessToken: string): Promise<[Workspace[], boolean]> {
        const [
            workspaces,
            status,
            errorMessage
        ] = await BordyApi.Workspaces.getWorkspaces(accessToken);

        if (status === 200) {
            return [workspaces, true];
        } else {
            return [workspaces, false]
        }
    }

}