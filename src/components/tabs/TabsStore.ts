import { defineStore } from 'pinia'
import type {WorkspaceElement, WorkspaceElementType} from "@/api/BoardsAndFoldersApi"

export class Tab {
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

export const useTabsStore = defineStore('tabs', {
    state: () => (
        {
            tabs: new Map<String, Tab[]>(),
            selectedTab: "" as String,
            tabToRender: undefined as Tab | undefined,
            selectedChildIndex: 0
        }
    ),
    getters: {
    },
    actions: {
        openTab(workspaceElement: Tab) {
            console.log("tabs: ");
            console.log(this.tabs);
            this.tabToRender = workspaceElement;

            // None tab is selected - dashboard page
            if (this.selectedTab === "") {
                this.tabs.set(workspaceElement.id, [workspaceElement]);
                this.selectedTab        = workspaceElement.id;
                this.selectedChildIndex = 0;

                return;
            }

            // Tab was opened and we are working with children
            let children = this.tabs.get(this.selectedTab);
            if (children === undefined) {
                console.error("openTab / children === undefined");
                children = [];
            }
            // check for possible duplicate
            let workspaceElementIndexIfPresent: number = -1;
            children.forEach((element, index) => {
                if (element.id === workspaceElement.id) {
                    workspaceElementIndexIfPresent = index;
                }
            })

            // it's child already. Switch to it
            if (workspaceElementIndexIfPresent != -1) {
                this.selectedChildIndex = workspaceElementIndexIfPresent;

                return;
            }

            // we are working with new path - close everything on right.
            if (children.length > 0) {
                children = children.slice(0, this.selectedChildIndex + 1);
            }

            children.push(workspaceElement);
            this.tabs.set(this.selectedTab, children);
            this.selectedChildIndex = children.length - 1;
        },
        closeTab(workspaceElementId: string) {
            if (workspaceElementId === this.selectedTab) {
                let keysList: Array<string> = []
                let tabToDeleteIndex = 0;
                let isTabToDeleteIndexFound = false;
                let tabToOpen = -1;
                for (let tab of this.tabs) {
                    keysList.push(tab.at(0) as string);

                    if (!isTabToDeleteIndexFound) {
                        tabToDeleteIndex += 1;
                    }
                    if (workspaceElementId === tab.at(0)) {
                        isTabToDeleteIndexFound = true;
                    }
                }

                // 1 means 0 index: tabToDeleteIndex - 1 = 0
                // open second element: 0 + 1 = 1
                if (tabToDeleteIndex === 1 && keysList.length > 0) {
                    tabToOpen = 1;
                } else {
                    // open previous element: -1 - current index, -1 - previous index
                    tabToOpen = tabToDeleteIndex - 2;
                }

                this.tabs.delete(workspaceElementId);
                if (tabToOpen === -1) {
                    this.selectedTab = "";
                    this.tabToRender = undefined;
                } else {
                    this.selectTab(keysList.at(tabToOpen) || "", 0);
                }
            } else {
                this.tabs.delete(workspaceElementId);
            }
        },
        closeAllTabs() {
            this.tabs.clear()
            this.selectedTab = ""
            this.tabToRender = undefined
        },
        selectTab(selectedTab: string, selectedChildIndex: number) {
            this.selectedTab = selectedTab;
            this.selectedChildIndex = selectedChildIndex;
            this.tabToRender = this.tabs.get(selectedTab)?.at(selectedChildIndex)
        }
    },
})