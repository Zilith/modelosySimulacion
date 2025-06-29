const UserService = require('../common/services/UserService')
const httpResponse = require('../../utils/httpResponse');
const tokenVerification = require('../../utils/tokenVerification');
const logger = require('../../utils/logger');

const deleteUser = async (event) => {
    const { cedula } = event.queryStringParameters;
    logger.info('Cedula obtenida', cedula);
    try {
        const user = tokenVerification(event);
        if (!user || user.scope !== 'administrador') {
            logger.error('Usuario no autorizado para borrar usuarios');
            return httpResponse.unauthorized(new Error('No tienes permiso para borrar usuarios'))(event.requestContext.path);
        }

        const userService = new UserService()
        const res = await userService.deleteEntity(cedula);

        logger.info('Usuario eliminado correctamente', res);
        return httpResponse.ok({ message: 'Usuario eliminado correctamente' })
    } catch (error) {
        logger.error('Error eliminando usuario', error);
        return httpResponse.badRequest(new Error('Error al eliminar usuario: ' + error.message))(event.requestContext.path);
    }
}

module.exports.handler = deleteUser
