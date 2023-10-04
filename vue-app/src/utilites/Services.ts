import { Conversation } from "../models/Types";
import { UserType } from "../models/User";
import { Response } from 'cross-fetch';

/** calls to API impelemts here */
export default class Services {
	public static async signup(user: UserType): Promise<Response> {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'POST',
            headers,
            body: JSON.stringify(user),
        };
        const resp = await fetch('/api/users/create', requestOptions);
        return resp;
    }

    public static async getLoginStatus(): Promise<Response> {
        var headers = new Headers();
        headers.append("Accept", "application/json");
        var requestOptions = {
            method: 'GET',
            headers,
        };
        const resp = await fetch('/api/users/check', requestOptions);
        return resp;
    }

    public static async getUserById(id: number): Promise<UserType> {
        var headers = new Headers();
        headers.append("Accept", "application/json");
        var requestOptions = {
            method: 'GET',
            headers,
        };
        const resp = await fetch(`/api/users/${id}`, requestOptions);
        const resJson = await resp.json();
        return resJson;
    }
}
