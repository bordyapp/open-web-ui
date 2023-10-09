import axios from "axios";
import type {WorkspaceElement} from "@/api/BoardsAndFoldersApi";

export class Workspace {
    public id:String
    public name:String
    public photo:String
    public ownerId:String
    public members:WorkspaceMember[]
    public invites:WorkspaceInvite[]
    public createdAt:Date
    public editedAt:Date
}

export class WorkspaceMember {
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
    public id: String
    public workspaceId: String
    public email: String
    public role: String
    public status: WorkspaceInviteStatus
    public createdAt:Date
}

export enum WorkspaceInviteStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED"
}

export class List {
    public id:String
    public name:String
    public workspaceId:String
    public boardId:String
    public boundBoardId:String
    public resources:ListResource[]
    public cards:Card[]
    public createdAt:Date
    public editedAt:Date
    public lexorank:String
    public numberOfCardsOnBoundBoard:number
    public numberOfDoneCardsOnBoundBoard:number
}

export class ListResource {
    public name: string;
    public capacity: number;

    constructor(name: string, capacity: number) {
        this.name = name;
        this.capacity = capacity;
    }
}

export class Card {
    public id:String
    public name:String
    public description:String
    public workspaceId:String
    public boardId:String
    public listId:String
    public boundBoardId:String
    public priority:CardPriority
    public status:CardStatus
    public dueDate:Date
    public resources:CardResource[] = []
    public labels:string[] = []
    public assignees: CardAssignee[] = []
    public assignedUserId:String
    public creatorUserId:String
    public isDone:boolean = false
    public createdAt:Date
    public editedAt:Date
    public numberOfComments: number
    public numberOfCardsOnBoundBoard:number
    public numberOfDoneCardsOnBoundBoard:number
    public lexorank:string
}

export class CardAssignee {
    id: string
    nickname: string
    picture: string

    constructor(id: string, nickname: string, picture: string) {
        this.id = id;
        this.nickname = nickname;
        this.picture = picture;
    }

}

export class CardResource {
    public name: string;
    public cost: number;

    constructor(name: string, cost: number) {
        this.name = name
        this.cost = cost
    }
}

export enum CardPriority {
    NO_PRIORITY = "no_priority",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export enum CardStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    DONE = "done",
    CLOSED = "closed",
}

type GetBoardOrFolderResponse = {
    data: WorkspaceElement | undefined
}

type CreateBoardListResponse = {
    data: List | undefined
}

export class WriteBoardListCardDto {
    name: String
    description: String
    priority: CardPriority | undefined
    status: CardStatus | undefined
    dueDate: Date | undefined
    resources: CardResource[]
    labels: String[]
    assignees: String[]
    assignedUserId: String | undefined
    isDone: boolean = false

    constructor(
        name: String,
        description: String,
        priority: CardPriority | undefined,
        status: CardStatus | undefined,
        dueDate: Date | undefined,
        resources: CardResource[],
        labels: String[],
        assignees: String[],
        assignedUserId: String | undefined,
        isDone: boolean = false
    ) {
        this.name = name
        this.description = description
        this.priority = priority
        this.status = status
        this.dueDate = dueDate
        this.resources = resources
        this.labels = labels
        this.assignedUserId = assignedUserId
        this.assignees = assignees
        this.isDone = isDone
    }
}

export class CardComment {
    id: string
    workspaceId: string
    cardId: string
    text: string
    creator: CardCommentCreator
    createdAt: Date
    editedAt: Date

    constructor(id: string, workspaceId: string, cardId: string, text: string, creator: CardCommentCreator, createdAt: Date, editedAt: Date) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.cardId = cardId;
        this.text = text;
        this.creator = creator;
        this.createdAt = createdAt;
        this.editedAt = editedAt;
    }
}
export class CardCommentCreator {
    id: string
    nickname: string
    picture: string

    constructor(id: string, nickname: string, picture: string) {
        this.id = id;
        this.nickname = nickname;
        this.picture = picture;
    }

}

const bordyHost = "http://localhost:8080";
export const BordieApi = {
    createWorkspace(accessToken: string, name: string) {
        return axios.post(
            `${bordyHost}/api/v1/gateway/workspaces`,
            {
                name: name
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    acceptWorkspaceInvite(accessToken: string, inviteId: string) {
        return axios.post(
            `${bordyHost}/api/v1/gateway/invites/${inviteId}/accept`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    createBoardList(accessToken: string, workspaceId: string, boardId: string, listName: string, listResources: ListResource[]) {
        return axios.post(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/boards/${boardId}/lists`,
            {
                name: listName,
                resources: listResources
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    updateBoardList(accessToken: string, workspaceId: string, boardId: string, listId: string, listName: string, listResources: ListResource[]) {
        return axios.put(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}`,
            {
                name: listName,
                resources: listResources
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    deleteBoardList(accessToken: string, workspaceId: string, boardId: string, listId: string) {
        return axios.delete(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    reorderBoardList(accessToken: string, workspaceId: string, boardId: string, listId: string, placeAfterElementWithId: string, placeBeforeElementWithId: string) {
        return axios.post(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/reorder`,
            {
                placeAfterElementWithId: placeAfterElementWithId,
                placeBeforeElementWithId: placeBeforeElementWithId
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    convertBoardListToBoard(accessToken: string, workspaceId: string, boardId: string, listId: string) {
        return axios.post(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/convert-to-board`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    createBoardListCard(accessToken: string, workspaceId: string, boardId: string, listId: string, writeBoardListCardDto: WriteBoardListCardDto) {
        return axios.post(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`,
            {
                name: writeBoardListCardDto.name,
                description: writeBoardListCardDto.description,
                priority: writeBoardListCardDto.priority,
                status: writeBoardListCardDto.status,
                dueDate: writeBoardListCardDto.dueDate?.toISOString(),
                resources: writeBoardListCardDto.resources,
                labels: writeBoardListCardDto.labels,
                assignees: writeBoardListCardDto.assignees,
                assignedUserId: writeBoardListCardDto.assignedUserId,
                isDone: writeBoardListCardDto.isDone,
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    updateBoardListCard(accessToken: string, workspaceId: string, boardId: string, listId: string, cardId: string, writeBoardListCardDto: WriteBoardListCardDto) {
        return axios.put(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}`,
            writeBoardListCardDto,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    deleteBoardListCard(accessToken: string, workspaceId: string, boardId: string, listId: string, cardId: string) {
        return axios.delete(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    convertBoardListCardToBoard(accessToken: string, workspaceId: string, boardId: string, listId: string, cardId: string) {
        return axios.post(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}/convert-to-board`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    markBoardListCardAsDone(accessToken: string, workspaceId: string, boardId: string, listId: string, cardId: string) {
        return axios.post(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}/mark-as-done`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    markBoardListCardAsNotDone(accessToken: string, workspaceId: string, boardId: string, listId: string, cardId: string) {
        return axios.post(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}/mark-as-not-done`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    moveBoardListCard(accessToken: string, workspaceId: string, boardId: string, listId: string, cardId: string, placeAfterElementWithId: string, placeBeforeElementWithId: string, targetListId: string) {
        return axios.post(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}/move`,
            {
                placeAfterElementWithId: placeAfterElementWithId,
                placeBeforeElementWithId: placeBeforeElementWithId,
                listId: targetListId,
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    async mySelf(accessToken: string, email: string, nickname: string, picture: string) {
        return axios.post(
            `${bordyHost}/api/v1/gateway/my-self`,
            {
                email: email,
                nickname: nickname,
                picture: picture
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    getComments(accessToken: string, workspaceId: string, cardId: string) {
        return axios.get(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/cards/${cardId}/comments`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    writeComment(accessToken: string, workspaceId: string, cardId: string, text: string) {
        return axios.post(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/cards/${cardId}/comments`,
            {
                "text": text
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    updateComment(accessToken: string, workspaceId: string, cardId: string, commentId: string, text: string) {
        return axios.put(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/cards/${cardId}/comments/${commentId}`,
            {
                "text": text
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    },
    deleteComment(accessToken: string, workspaceId: string, cardId: string, commentId: string) {
        return axios.delete(
            `${bordyHost}/api/v1/gateway/workspaces/${workspaceId}/cards/${cardId}/comments/${commentId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
    }
}