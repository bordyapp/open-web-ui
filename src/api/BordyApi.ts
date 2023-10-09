import {WorkspacesApi} from "@/api/WorkspacesApi";
import {DocsAndFilesApi} from "@/api/DocsAndFilesApi";
import {TasksApi} from "@/api/TasksApi";
import {BoardsAndFoldersApi} from "@/api/BoardsAndFoldersApi";

const host: string = "http://localhost:8080";

export const BordyApi = {
    Workspaces: new WorkspacesApi(host),
    DocsAndFiles: new DocsAndFilesApi(host),
    Tasks: new TasksApi(host),
    BoardsAndFolders: new BoardsAndFoldersApi(host)
};