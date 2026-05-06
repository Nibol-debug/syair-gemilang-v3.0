import { RolesService } from './roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(data: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
    }>;
    findAll(): Promise<({
        permissions: ({
            permission: {
                id: string;
                name: string;
            };
        } & {
            role_id: string;
            permission_id: string;
        })[];
    } & {
        id: string;
        name: string;
    })[]>;
    findOne(id: string): Promise<{
        permissions: ({
            permission: {
                id: string;
                name: string;
            };
        } & {
            role_id: string;
            permission_id: string;
        })[];
    } & {
        id: string;
        name: string;
    }>;
    update(id: string, data: {
        name?: string;
        permissionIds?: string[];
    }): Promise<{
        id: string;
        name: string;
    }>;
}
