const { request, response } = require('express');
const Empresa = require('../models/empresa');
const bcrypt = require('bcryptjs');


const getEmpresas = async (req = request, res = response) => {

     //condiciones del get
     const query = { estado: true };

     const listaEmpresas = await Promise.all([
         Empresa.countDocuments(query),
         Empresa.find(query)
     ]);
 
     res.json({
         msg: 'get Api - Controlador Empresas1',
         listaEmpresas
     });

}


const getEmpresasPorID = async (req = request, res = response) => {

   const { id } = req.params;
   const empresaById = await Empresa.findById( id );

   res.status(201).json( empresaById );

}


const postEmpresas = async (req = request, res = response) => {
    //toUpperCase para todo a Mayusculas
    const nombre = req.body.nombre.toUpperCase();

    const empresaDB = await Empresa.findOne({ nombre });

    //validacion para verificar si ya existe dicha categoria para que no lo agregue
    if (empresaDB) {
        return res.status(400).json({
            msg: `La empresa ${empresaDB.nombre}, ya existe`
        });
    }
        //Encriptar password
    const salt = bcrypt.genSaltSync();
    const passwordEncriptado = bcrypt.hashSync(req.body.password, salt);

    // Generar la data a guardar
    const data = {
        nombre,
        tipo: req.body.tipo,
        correo: req.body.correo,
        password: passwordEncriptado
    }

    const empresa = new Empresa(data);
    //Guardar en DB
    await empresa.save();

    res.status(201).json(empresa);

}


const putEmpresas = async (req = request, res = response) => {

    const { id } = req.empresa;
    const { estado,  ...resto } = req.body;

    resto.nombre = resto.nombre.toUpperCase();

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync(req.body.password, salt);
    //Editar o actualiar la cateogira
    const empresaEditada = await Empresa.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json(empresaEditada);

}

const deleteEmpresas = async (req = request, res = response) => {

    const { id } = req.empresa;

    //Editar o actualiar la cateogira: Estado FALSE
    const empresaBorrada = await Empresa.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(201).json(empresaBorrada);

}




module.exports = {
    getEmpresas,
    getEmpresasPorID,
    postEmpresas,
    putEmpresas,
    deleteEmpresas
}
