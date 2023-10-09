import { defineStore } from 'pinia'
import {ref} from "vue";
import type {Workspace} from "@/api/WorkspacesApi"
import {WorkspacesService} from "@/api/WorkspacesService";

export const useWorkspacesStore = defineStore('workspaces', {
    state: () => (
        {
            isLoading: ref<boolean>(true),
            isLoadingError: ref<boolean>(false),
            workspaces: ref<Workspace[]>([]),
            selectedWorkspace: ref<Workspace | undefined>(undefined)
        }
    ),
    getters: {
        loadedWithoutErrors(): boolean {
            return this.isLoading === false && this.isLoadingError === false;
        },
        loadedWithErrors(): boolean {
            return this.isLoading === false && this.isLoadingError === true;
        },
        userWithoutWorkspaces(): boolean {
            return this.workspaces.length === 0;
        },
        userWithWorkspaces(): boolean {
            return this.workspaces.length > 0;
        }
    },
    actions: {
        selectWorkspace(workspace: Workspace | undefined) {
            this.selectedWorkspace = workspace;
        },
        async loadWorkspaces(accessToken: string) {
            if (this.workspaces?.length > 0) {
                return;
            }

            this.isLoading = true;
            this.isLoadingError = false;

            const [workspaces, success] = await WorkspacesService.loadWorkspaces(accessToken);
            if (success) {
                this.workspaces = workspaces;
                this.selectedWorkspace = workspaces.at(0);
            } else {
                this.isLoadingError = true;
            }

            this.isLoading = false
        }
    },
})