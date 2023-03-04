const { request, response } = require('express');
const Empresa = require('../models/empresa');
const { v4: uuidv4 } = require('uuid');


function generateID() {
    return uuidv4();
  }

const getSucursalesPorEmpresa = async (req = request, res = response) => {
     //condiciones del get
     const query = { estado: true, _id: req.empresa.id };

     
     const listaSucursales = await Promise.all([
         Empresa.countDocuments(query),
         Empresa.find(query)
     ]);
 
     return res.json({
        msg: 'get Api - Sucursales de una Empresa',
        listaSucursales
     });

}


const getSucursalesPorID = async (req = request, res = response) => {

   const { id } = req.params;
   const empresaById = await Empresa.findById( id );

   res.status(201).json( empresaById );

}


const postSucursales = async (req = request, res = response) => {
    const { id } = req.empresa;
    const { estado,  ...resto } = req.body;

    const { sucursales } = await Empresa.findById(id);

    //validacion para verificar si ya existe dicha sucursal para que no lo agregue
    const existeSucursal = sucursales.find((sucursal) => sucursal.nombre === resto.nombre);

    if (existeSucursal) {
        return res.status(400).json({
            msg: `La Sucursal Ya existe `
        });
    } else {
        sucursales.push({ 
            id: generateID(),
            nombre: req.body.nombre,
            ubicacion: req.body.ubicacion
        });
    }

    //Guardar en DB
    await Empresa.findByIdAndUpdate(id, { sucursales });

    res.status(201).json(sucursales);

}


const putSucursales = async (req = request, res = response) => {
    const { id } = req.empresa;
    const {idSucursal} = req.params;

    const { sucursales } = await Empresa.findById(id);

    //validacion para verificar si ya existe dicha sucursal
    const existeSucursal = sucursales.find(sucursal => sucursal.id ===  idSucursal);

    if (!existeSucursal) {
        return res.status(400).json({
            msg: `La Sucursal no existe o no le pertenece`
        });
    } else {
       existeSucursal.nombre = req.body.nombre;
       existeSucursal.ubicacion = req.body.ubicacion;
    }

    //Guardar en DB
    await Empresa.findByIdAndUpdate(id, { sucursales });

    res.status(201).json(sucursales);

}

const deleteSucursales = async (req = request, res = response) => {
    const { id } = req.empresa;
    const {idSucursal} = req.params;

    const { sucursales } = await Empresa.findById(id);

    //Verificar que existe la sucursal a eliminar
    const existeSucursal = sucursales.find(sucursal => sucursal.id ===  idSucursal);
    if (!existeSucursal) {
        return res.status(400).json({
            msg: `La Sucursal no existe `
        });
    }
    const arregloActualizado = sucursales.filter(sucursal => sucursal.id !==  idSucursal);
    res.status(201).json(arregloActualizado);
    await Empresa.findByIdAndUpdate(id, { sucursales: arregloActualizado });


}




module.exports = {
    getSucursalesPorEmpresa,
    getSucursalesPorID,
    postSucursales,
    putSucursales,
    deleteSucursales
}
