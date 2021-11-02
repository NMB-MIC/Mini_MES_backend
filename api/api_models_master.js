const express = require("express");
const router = express.Router();
const constants = require("./../constant/constant");
const formidable = require("formidable");
const fs = require("fs");

//models
const models_master = require('../database/model/models_master');
const user = require("./../database/model/user");

router.get("/model", async (req, res) => {
    try {
        let result = await models_master.findAll({
            attributes: ['model_name', 'model_number', 'createdAt', 'updatedAt', 'updater']
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

router.get("/model/:model_number", async (req, res) => {
    try {
        const { model_number } = req.params;
        let result = await models_master.findAll({
            where: {
                model_number,
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

router.post("/model", async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            console.log("error : " + JSON.stringify(error));
            console.log("Fields : " + JSON.stringify(fields));
            console.log("Files : " + JSON.stringify(files));

            const { model_number, model_name, updater } = fields

            let userLevel = await user.findOne({ where: { username: updater } })
            if (userLevel.levelUser === 'admin' || userLevel.levelUser === 'power') {
                let data = {
                    model_number,
                    model_name,
                    updater,
                }
                try {
                    if (files.drawing) {
                        data.drawing = await fs.readFileSync(files.drawing.path)
                        await models_master.create(data);
                        fs.unlinkSync(files.drawing.path);
                    } else {
                        await models_master.create(data);
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

router.patch("/model", async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            console.log("error : " + JSON.stringify(error));
            console.log("Fields : " + JSON.stringify(fields));
            console.log("Files : " + JSON.stringify(files));

            const { model_number, model_name, updater } = fields

            let userLevel = await user.findOne({ where: { username: updater } })
            if (userLevel.levelUser === 'admin' || userLevel.levelUser === 'power') {


                let data = {
                    model_number,
                    updater,
                }
                if (model_name) {
                    data.model_name = model_name
                }

                if (files.drawing) {
                    data.drawing = await fs.readFileSync(files.drawing.path)
                    await models_master.update(data, { where: { model_number } });
                    fs.unlinkSync(files.fileDetail.path);
                } else {
                    await models_master.update(data, { where: { model_number } });
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

router.delete("/model", async (req, res) => {
    try {
        //check updater class
        let { updater, model_number } = req.body
        let userLevel = await user.findOne({ where: { username: updater } })
        if (userLevel.levelUser === 'admin' || userLevel.levelUser === 'power') {
            await models_master.destroy({ where: { model_number } });
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


