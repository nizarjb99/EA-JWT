import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';


export const authorizeRoles = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {

        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }


        const userRole = req.user.role || 'user';


        if (!roles.includes(userRole)) {
            return res.status(403).json({
                message: 'Acceso denegado: no tienes los permisos necesarios para realizar esta acción'
            });
        }


        next();
    };
};
