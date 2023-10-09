import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0, createAuthGuard } from "@auth0/auth0-vue";
import { createRouter, createWebHashHistory} from 'vue-router'
import App from './App.vue'
import WorkspaceSettingsPage from "@/pages/WorkspaceSettingsPage.vue";

import './assets/main.css'
import CreateWorkspacePage from "@/CreateWorkspacePage.vue";
import InvitePage from "@/InvitePage.vue";

import VueMixpanel from "./VueMixpanel";
import BoardsPage from "@/pages/BoardsPage.vue";
import FolderPage from "@/pages/boards/FolderPage.vue";
import BoardPage from "@/pages/boards/BoardPage.vue";
import MyTasksPage from "@/pages/MyTasksPage.vue";
import DocsAndFilesPage from "@/pages/DocsAndFilesPage.vue";
import TeamPage from "@/pages/TeamPage.vue";
import ReleaseNotesPage from "@/pages/ReleaseNotesPage.vue";
import ProfilePage from "@/pages/ProfilePage.vue";

const auth0= createAuth0({
    domain: "{auth0_app_domain}",
    clientId: "{auth0_app_client_id}",
    authorizationParams: {
        audience: 'localhost',
        redirect_uri: window.location.origin
    }
})

const app = createApp(App);
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: BoardsPage,
            beforeEnter: createAuthGuard(app)
        },
        {
            path: '/folder/:folderId',
            name: 'folder-page',
            props: true,
            component: FolderPage,
            beforeEnter: createAuthGuard(app)
        },
        {
            path: '/board/:boardId',
            name: 'board-page',
            props: true,
            component: BoardPage,
            beforeEnter: createAuthGuard(app)
        },
        {
            path: '/my-tasks',
            name: 'my-tasks',
            component: MyTasksPage,
            beforeEnter: createAuthGuard(app)
        },
        {
            path: '/docs-and-files',
            name: 'docs-and-files',
            component: DocsAndFilesPage,
            beforeEnter: createAuthGuard(app)
        },
        {
            path: '/team',
            name: 'team',
            component: TeamPage,
            beforeEnter: createAuthGuard(app)
        },
        {
            path: '/release-notes',
            name: 'release-notes',
            component: ReleaseNotesPage,
            beforeEnter: createAuthGuard(app)
        },
        {
            path: '/profile',
            name: 'profile',
            component: ProfilePage,
            beforeEnter: createAuthGuard(app)
        },
        {
            path: '/workspace/:workspaceId/settings',
            name: 'workspace-settings',
            props: true,
            component: WorkspaceSettingsPage,
            beforeEnter: createAuthGuard(app)
        },
        {
            path: '/workspace',
            name: 'create-workspace',
            props: true,
            component: CreateWorkspacePage,
            beforeEnter: createAuthGuard(app)
        },
        {
            path: '/invite:token',
            name: 'invite-page',
            props: true,
            component: InvitePage,
            beforeEnter: createAuthGuard(app)
        }
    ],
});

app.use(router);
app.use(auth0);
app.use(createPinia());
app.use(VueMixpanel, {
    token: "{mixpanel_token}",
    config: {
        debug: true,
        persistence: 'localStorage'
    }
})
app.mount('#app');
