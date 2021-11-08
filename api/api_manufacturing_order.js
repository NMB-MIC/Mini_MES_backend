const express = require("express");
const router = express.Router();
const constants = require("./../constant/constant");
const formidable = require("formidable");
const fs = require("fs");

//models
const mo = require("./../database/model/manufacturing_order")
const user = require("./../database/model/user");

router.get("/mo", async (req, res) => {
    try {
        let result = await mo.findAll();

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

router.post("/mo", async (req, res) => {
    try {
        //Insert to db
        let result = await mo.create(req.body);

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

router.patch("/mo", async (req, res) => {
    try {
        //check updater class
        let { updater, manufacturing_order_number } = req.body
        let userLevel = await user.findOne({ where: { username: updater } })
        if (userLevel.levelUser === 'admin' || userLevel.levelUser === 'power') {
            await mo.update(req.body, { where: { manufacturing_order_number } });
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

router.delete("/mo", async (req, res) => {
    try {
        //check updater class
        let { updater, manufacturing_order_number } = req.body
        let userLevel = await user.findOne({ where: { username: updater } })
        if (userLevel.levelUser === 'admin' || userLevel.levelUser === 'power') {
            await mo.destroy({ where: { manufacturing_order_number } });
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