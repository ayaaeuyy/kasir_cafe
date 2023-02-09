/** load model for table 'menu' */
const menuModel = require(`../models/index`).menu
/** load Operation from Sequelize */
const Op = require(`sequelize`).Op
/** load library 'path' and 'filestream' */
const path = require(`path`)
const fs = require(`fs`)

//import auth
const auth = require("../auth")
// app.use(auth)

/** create function to read all data */
exports.getAllMenu = async (request, response) => {
    /** call findAll() to get all data */
    let menu = await menuModel.findAll()
    return response.json({
        success: true,
        data: menu,
        message: `All Menus have been loaded`
    })
}

/** create function for filter */
exports.findMenu = async (request, response) => {
    /** define keyword to find data */
    let keyword = request.body.keyword
    /** call findAll() within where clause and operation
    * to find data based on keyword */
    let menu = await menuModel.findAll({
        where: {
            [Op.or]: [
                { nama_menu: { [Op.substring]: keyword } },
                { jenis: { [Op.substring]: keyword } },
                { deskripsi: { [Op.substring]: keyword } },
            ]
        }
    })
    return response.json({
        success: true,
        data: menu,
        message: `All Menu have been loaded`
    })
}

/** load function from `upload-gambar`
* single(`gambar`) means just upload one file
* with request name `gambar`
*/
const upload = require(`./upload-gambar`).single(`gambar`)

/** create function to add new menu */

exports.addMenu = (request, response) => {
    /** run function upload */
    upload(request, response, async error => {
        /** check if there are errorwhen upload */
        if (error) {
            return response.json({ message: error })
        }
        /** check if file is empty */
        if (!request.file) {
            return response.json({
                message: `Nothing to Upload`
            })
        }
        /** prepare data from request */
        let newMenu = {
            nama_menu: request.body.nama_menu,
            jenis: request.body.jenis,
            deskripsi: request.body.deskripsi,
            gambar: request.file.filename
        }
        /** execute inserting data to menu's table */
        menuModel.create(newMenu)
            .then(result => {
                /** if insert's process success */
                return response.json({
                    success: true,
                    data: result,
                    message: `New Menu has been inserted`
                })
            })
            .catch(error => {
                /** if insert's process failed */
                return response.json({
                    success: false,
                    message: error.message
                })
            })
    })
}

/** create function to update menu */
exports.updateMenu = async (request, response) => {
    /** run upload function */
    upload(request, response, async error => {
        /** check if there are error when upload */
        if (error) {
            return response.json({ message: error })
        }
        /** store selected menu ID that will update */
        let id = request.params.id
        /** prepare menu's data that will update */
        let menu = {
            nama_menu: request.body.nama_menu,
            jenis: request.body.jenis,
            deskripsi: request.body.deskripsi,
        }
        /** check if file is not empty,
        * it means update data within reupload file
        */
        if (request.file) {
            /** get selected menu's data */
            const selectedMenu = await menuModel.findOne({
                where: { id: id_menu }
            })
            /** get old filename of gambar file */
            const oldGambarMenu = selectedMenu.gambar
            /** prepare path of old gambar to delete file */
            const pathGambar = path.join(__dirname, `../gambar`,
                oldGambarMenu)
            /** check file existence */
            if (fs.existsSync(pathGambar)) {
                /** delete old gambar file */
                fs.unlink(pathGambar, error =>
                    console.log(error))
            }

            /** add new gambar filename to menu object */
            menu.gambar = request.file.filename
        }
        /** execute update data based on defined id menu */
        menuModel.update(menu, { where: { id: id_menu } })
            .then(result => {
                /** if update's process success */
                return response.json({
                    success: true,
                    message: `Data menu has been updated`
                })
            })
            .catch(error => {
                /** if update's process fail */
                return response.json({
                })
            })
    })
}

/** create function to delete menu */
exports.deleteMenu = async (request, response) => {
    /** store selected menu's ID that will be delete */
    const id = request.params.id
    /** -- delete gambar file -- */
    /** get selected menu's data */
    const menu = await menuModel.findOne({ where: { id: id } })
    /** get old filename of gambar file */
    const oldGambarMenu = menu.gambar
    /** prepare path of old gambar to delete file */
    const pathGambar = path.join(__dirname, `../gambar`,
        oldGambarMenu)
    /** check file existence */
    if (fs.existsSync(pathGambar)) {
        /** delete old gambar file */
        fs.unlink(pathGambar, error => console.log(error))
    }
    /** -- end of delete gambar file -- */

    /** execute delete data based on defined id menu */
    menuModel.destroy({ where: { id: id } })
        .then(result => {
            /** if update's process success */
            return response.json({
                success: true,
                message: `Data menu has been deleted`
            })
        })
        .catch(error => {
            /** if update's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}



