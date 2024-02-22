export type UserType = {
    id?: number;
    email: string,
    user_name: string,
    password?: string,
    verified?: number,
    public_key: string,
    status?: string,
}

export default class User {
    public readonly email: string;
    
    public readonly user_name: string;

    public readonly id: number;
    
    public conversation_id: number[];

    private static instance: User;

    static users: UserType[] = [];

    public readonly verified?: number;

    public readonly public_key: string;

    private constructor(user: UserType) {
        this.email = user.email;
        this.user_name = user.user_name;
        this.id = user.id;
        this.verified = user.verified;
        this.conversation_id = [];
    }

    public static getLoggedInStatus() {
        if (!User.instance) {
            return false;
        }
        return true;
    }

    public static getUser(): User {
        if (!User.instance) {
            throw('no user set yet')
        }
        return User.instance;
    }

    public static async waitingForUser(): Promise<User> {
        return new Promise((res, rej) => {
            let counter = 0;
            const waiting = setInterval(() => {                
                if (counter++ > 20) {
                    clearInterval(waiting);
                    rej('can not get the user!');
                }
                if (!User.instance) {
                    return;
                }
                clearInterval(waiting);
                res(User.instance);
            }, 500);
        });
        
    }

    public static setUser(user: UserType) {        
        User.instance = new User(user);
    }
}