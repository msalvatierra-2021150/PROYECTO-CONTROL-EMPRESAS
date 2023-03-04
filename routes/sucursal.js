const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { getSucursalesPorEmpresa, getSucursalesPorID, postSucursales, deleteSucursales, putSucursales } = require('../controllers/sucursal');
const { existeCategoriaPorId } = require('../helpers/db-validators');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

//Manejo de rutas

// Obtener todas las categorias - publico
router.get('/mostrar', [
    validarJWT
] , getSucursalesPorEmpresa );

// Obtener una categoria por id - publico
router.get('/mostrar', [
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    //check('id').custom( existeCategoriaPorId ),
    validarCampos
], getSucursalesPorID );

// Crear categoria - privada - cualquier persona con un token válido
router.post('/agregar', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
] ,postSucursales);

// Actuaizar categoria - privada - cualquier persona con un token válido
router.put('/editar/:idSucursal', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //check('id').custom( existeCategoriaPorId ),
    validarCampos
] ,putSucursales);

//Borrar una categoria - privado - Solo el admin puede eliminar una categoria (estado: false)
router.delete('/eliminar/:idSucursal', [
    validarJWT,
    //check('id').custom( existeCategoriaPorId ),
    validarCampos
] ,deleteSucursales);



module.exports = router;