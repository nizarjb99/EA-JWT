import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

/**
 * Middleware para verificar si el usuario tiene el rol adecuado.
 * Debe usarse SIEMPRE después del middleware `authenticateToken`, 
 * ya que depende de que `req.user` exista.
 * 
 * @param roles Array de roles permitidos (ej. ['admin', 'manager'])
 */
export const authorizeRoles = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        // Obtenemos el usuario del request (inyectado previamente por authenticateToken)
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        // Si el usuario no tiene rol en su token, asumimos que es 'user' básico
        const userRole = req.user.role || 'user';

        // Verificamos si el rol del usuario está dentro de los roles permitidos para esta ruta
        if (!roles.includes(userRole)) {
            return res.status(403).json({
                message: 'Acceso denegado: no tienes los permisos necesarios para realizar esta acción'
            });
        }

        // Si el rol es correcto, permitimos que la petición continúe hacia el controlador
        next();
    };
};
