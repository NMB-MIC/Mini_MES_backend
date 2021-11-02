const express = require("express");
const router = express.Router();
const constants = require("./../constant/constant");
const formidable = require("formidable");
const fs = require("fs");

//models
const materials_master = require('../database/model/materials_master');
const user = require("./../database/model/user");

router.get("/material", async (req, res) => {
    try {
        let result = await materials_master.findAll({
            attributes: ['material_number', 'material_name', 'unit_of_measure' , 'createdAt', 'updatedAt', 'updater']
        });

        res.json({
            result,
            api_result: constants.kResultOk,
        });
    } catch (error) {
        res.json({
            error,
            api_result: constants.kResultNok,
        });
    }
});

router.get("/material/:model_number", async (req, res) => {
    try {
        const { material_number } = req.params;
        let result = await materials_master.findAll({
            where: {
                material_number,
            },
        });
        res.json({
            result,
            api_result: constants.kResultOk,
        });
    } catch (error) {
        res.json({
            result: JSON.stringify(error),
            api_result: constants.kResultNok,
        });
    }
});

router.post("/material", async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            console.log("error : " + JSON.stringify(error));
            console.log("Fields : " + JSON.stringify(fields));
            console.log("Files : " + JSON.stringify(files));

            const { material_number, material_name, unit_of_measure, updater } = fields

            let userLevel = await user.findOne({ where: { username: updater } })
            if (userLevel.levelUser === 'admin' || userLevel.levelUser === 'power') {

                let data = {
                    material_number,
                    material_name,
                    unit_of_measure,
                    updater,
                }
                try {
                    if (files.drawing) {
                        data.drawing = await fs.readFileSync(files.drawing.path)
                        await materials_master.create(data);
                        fs.unlinkSync(files.fileDetail.path);
                    } else {
                        await materials_master.create(data);
                    }
                } catch (error2) {
                    console.log(error2);
                    res.json({
                        error2,
                        api_result: constants.kResultNok,
                    });
                }
                res.json({
                    api_result: constants.kResultOk,
                });
            } else {
                res.json({
                    error: 'permission denied',
                    api_result: constants.kResultNok,
                });
            }
        })
    } catch (error) {
        console.log(error);
        res.json({
            error,
            api_result: constants.kResultNok,
        });
    }
})

router.patch("/material", async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            console.log("error : " + JSON.stringify(error));
            console.log("Fields : " + JSON.stringify(fields));
            console.log("Files : " + JSON.stringify(files));

            const { material_number, material_name, unit_of_measure, updater } = fields

            let userLevel = await user.findOne({ where: { username: updater } })
            if (userLevel.levelUser === 'admin' || userLevel.levelUser === 'power') {

                let data = {
                    material_number,
                    updater,
                }
                if (material_name) {
                    data.material_name = material_name
                }
                if (unit_of_measure) {
                    data.unit_of_measure = unit_of_measure
                }

                if (files.drawing) {
                    data.drawing = await fs.readFileSync(files.drawing.path)
                    await materials_master.update(data, { where: { material_number } });
                    fs.unlinkSync(files.fileDetail.path);
                } else {
                    await materials_master.update(data, { where: { material_number } });
                }
                res.json({
                    api_result: constants.kResultOk,
                });
            } else {
                res.json({
                    error: 'permission denied',
                    api_result: constants.kResultNok,
                });
            }
        })
    } catch (error) {
        console.log(error);
        res.json({
            error,
            api_result: constants.kResultNok,
        });
    }
});

router.delete("/material", async (req, res) => {
    try {
        //check updater class
        let { updater, material_number } = req.body
        let userLevel = await user.findOne({ where: { username: updater } })
        if (userLevel.levelUser === 'admin' || userLevel.levelUser === 'power') {
            await materials_master.destroy({ where: { material_number } });
            res.json({
                api_result: constants.kResultOk,
            });
        } else {
            res.json({
                api_result: constants.kResultNok,
                error: 'permission denied',
            });
        }
    } catch (error) {
        res.json({
            api_result: constants.kResultNok,
            error,
        });
    }
});

module.exports = router;
