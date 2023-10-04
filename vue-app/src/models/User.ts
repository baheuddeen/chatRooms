export type UserType = {
    id?: number;
    email: string,
    user_name: string,
    password?: string,
}

export default class User {
    public readonly email: string;
    
    public readonly user_name: string;

    public readonly id: number;
    
    public conversation_id: number[];

    private static instance: User;

    static users: UserType[] = [];

    private constructor(user: UserType) {
        this.email = user.email;
        this.user_name = user.user_name;
        this.id = user.id;
        this.conversation_id = [];
    }

    public static getUser(): User {
        if (!User.instance) {
            throw new Error('user not set yet !');
        }
        return User.instance;
    }

    public static setUser(user: UserType) {
        User.instance = new User(user);
    }
}