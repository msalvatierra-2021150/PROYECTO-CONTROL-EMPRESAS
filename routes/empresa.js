const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { getEmpresas, postEmpresas, putEmpresas, deleteEmpresas } = require('../controllers/empresa');
const { existeCategoriaPorId } = require('../helpers/db-validators');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

//Manejo de rutas

// Obtener todas las categorias - publico
router.get('/mostrar', getEmpresas );

// Obtener una categoria por id - publico
router.get('/mostrar/:id', [
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    //check('id').custom( existeCategoriaPorId ),
    validarCampos
], getEmpresas );

// Crear categoria - privada - cualquier persona con un token válido
router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
] ,postEmpresas);

// Actuaizar categoria - privada - cualquier persona con un token válido
router.put('/editar', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //check('id').custom( existeCategoriaPorId ),
    validarCampos
] ,putEmpresas);

//Borrar una categoria - privado - Solo el admin puede eliminar una categoria (estado: false)
router.delete('/eliminar', [
    validarJWT,
    //check('id').custom( existeCategoriaPorId ),
    validarCampos
] ,deleteEmpresas);



module.exports = router;