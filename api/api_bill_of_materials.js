const express = require("express");
const router = express.Router();
const constants = require("./../constant/constant");

//models
const bom = require('../database/model/bill_of_materials');
const user = require("./../database/model/user");

router.get("/bom", async (req, res) => {
    try {
        let result = await bom.findAll();
        let bom_model_list = await bom.findAll()

        res.json({
            result,
            bom_model_list,
            api_result: constants.kResultOk,
        });
    } catch (error) {
        res.json({
            error,
            api_result: constants.kResultNok,
        });
    }
});

router.get("/bom/:model_number", async (req, res) => {
    try {
        const { model_number } = req.params;
        let result = await bom.findAll({
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

router.post("/bom", async (req, res) => {
    try {
        //Insert to db
        let result = await bom.create(req.body);

        res.json({
            result,
            api_result: constants.kResultOk,
        });

    } catch (error) {
        console.log(error);
        res.json({
            error,
            api_result: constants.kResultNok,
        });
    }
});

router.patch("/bom", async (req, res) => {
    try {
        //check updater class
        let { updater, model_number, material_number } = req.body
        let userLevel = await user.findOne({ where: { username: updater } })
        if (userLevel.levelUser === 'admin' || userLevel.levelUser === 'power') {
            await bom.update(req.body, { where: { model_number, material_number } });
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

router.delete("/bom", async (req, res) => {
    try {
        //check updater class
        let { updater, model_number, material_number } = req.body
        let userLevel = await user.findOne({ where: { username: updater } })
        if (userLevel.levelUser === 'admin' || userLevel.levelUser === 'power') {
            await bom.destroy({ where: { model_number, material_number } });
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