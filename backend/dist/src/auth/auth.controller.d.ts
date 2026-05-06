import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        access_token: string;
    }>;
    getProfile(req: any): any;
    logout(): Promise<{
        message: string;
    }>;
    registerDevice(req: any, body: {
        device_id: string;
    }): Promise<{
        id: string;
        is_active: boolean;
        user_id: string;
        device_id: string;
    }>;
}
