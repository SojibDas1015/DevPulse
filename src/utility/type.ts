export interface IUserSignUp {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface IUserIssues {
    title: string;
    description: string;
    type: string;
}

export interface IUserGetAllIssues {
    status?: string;
    sort? : string;
    type?: string
}