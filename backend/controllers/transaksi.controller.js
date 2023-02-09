const app = require("../routes/transaksi.route")

/** load model for `transaksi` table */
const transaksiModel = require(`../models/index`).transaksi
/** load model for `details_transaksi` table */
const detailTransaksiModel =
    require(`../models/index`).detail_transaksi
/** load Operator from Sequelize */
const Op = require(`sequelize`).Op


/** create function for add transaksi */
exports.addTransaksi = async (request, response) => {
    /** prepare data for transaksi table */
    let newData = {
        tgl_transaksi: request.body.tgl_transaksi,
        id_user: request.body.id_user,
        id_meja: request.body.id_meja,
        nama_pelanggan: request.body.nama_pelanggan,
        status: request.body.status
    }

    /** execute for inserting to transaksi's table */
    transaksiModel.create(newData)
        .then(result => {
            /** get the latest id of book transaksi*/
            let idTransaksi = result.id
            /** store details of book transaksi from request
            * (type: array object)
            */
            let detailTransaksi = request.body.detail_transaksi
            /** insert diTransaksi to each item of detailTransaksi
            */
            for (let i = 0; i < detailTransaksi.length; i++) {
                detailTransaksi[i].idTransaksi = idTransaksi
            }
            /** insert all data of detailTransaksi */
            detailTransaksiModel.bulkCreate(detailTransaksi)
                .then(result => {
                    return response.json({
                        success: true,
                        message: `New Transaction has been
inserted`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for update transaksi */
exports.updateTransaksi = async (request, response) => {
    /** prepare data for transaksi's table */
    let newData = {
        tgl_transaksi: current,
        id_user: request.body.id_user,
        id_meja: request.body.id_meja,
        nama_pelanggan: request.body.nama_pelanggan,
        status: request.body.status
    }
    /** prepare parameter transaksi ID */
    let idTransaksi = request.params.id
    /** execute for inserting to transaksi's table */
    transaksiModel.update(newData, { where: { id: idTransaksi } })
        .then(async result => {
            /** delete all detailTransaksi based on idTransaksi */
            await detailTransaksiModel.destroy(
                { where: { idTransaksi: idTransaksi } }
            )
            /** store details of transaksi from request
            * (type: array object)
            */
            let detailTransaksi = request.body.detail_transaksi
            /** insert idTransaksi to each item of detailTransaksi
            */
            for (let i = 0; i < detailTransaksi.length; i++) {
                detailTransaksi[i].idTransaksi = idTransaksi
            }
            /** re-insert all data of detailTransaksi */
            detailTransaksiModel.bulkCreate(detailTransaksi)
                .then(result => {
                    return response.json({
                        success: true,
                        message: `Transaction has been
    updated`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

// create function for filter
exports.searchTransaksi = async (request, response) => {
    // define keyword to find data
    let keyword = request.body.keyword

    // call findAll() within where clause and
    // operation to find data based on keyword
    let transaksi = await transaksiModel.findAll({
        where: {
            [Op.or]: [
                { tgl_transaksi: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({
        success: true,
        data: detail_transaksi,
        message: 'Searching success'
    })
}

/** create function for delete transaksi's data */
exports.deleteTransaksi = async (request, response) => {
    /** prepare idTransaksi that as paramter to delete */
    let idTransaksi = request.params.id
    /** delete detailTransaksi using model */
    detailTransaksiModel.destroy(
        { where: { idTransaksi: idTransaksi } }
    )
        .then(result => {
            /** delete transaksis data using model */
            transaksiModel.destroy({ where: { id: idTransaksi } })
                .then(result => {
                    return response.json({
                        success: true,
                        message: `Transaksi's has deleted`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for return transaksi */
exports.returnMenu = async (request, response) => {
    /** prepare idTransaksi that will be return */
    let idTransaksi = request.params.id
    /** prepare current time for return's time */
    let today = new Date()
    let currentDate = `${today.getFullYear()}-${today.getMonth()
        + 1}-${today.getDate()}`
    /** update status and date_of_return from transaksi's data */
    transaksiModel.update(
        {
            date_of_return: currentDate,
            status: true
        },
        {
            where: { id: idTransaksi }
        }
    )
        .then(result => {
            return response.json({
                success: true,
                message: `Book has been returned`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for get all transaksi data */
exports.getTransaksi = async (request, response) => {
    let data = await transaksiModel.findAll(
        {
            include: [
                `member`, `admin`,
                {
                    model: detailTransaksiModel,
                    as: `detail_transaksi`,
                    include: ["menu"]
                }
            ]
        }
    )
    return response.json({
        success: true,
        data: data,
        message: `All transaction book have been loaded`
    })
}
