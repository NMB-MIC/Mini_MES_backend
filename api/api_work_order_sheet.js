const express = require("express");
const router = express.Router();
const constants = require("./../constant/constant");

//models
const wos = require("./../database/model/work_order_sheet")
const user = require("./../database/model/user");


router.get("/wos", async (req, res) => {
    try {
        let result = await wos.findAll();

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

router.post("/wos", async (req, res) => {
    try {
        //Insert to db
        let result = await wos.create(req.body);

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

router.patch("/wos", async (req, res) => {
    try {
        //check updater class
        let { updater, WOS_number } = req.body
        let userLevel = await user.findOne({ where: { username: updater } })
        if (userLevel.levelUser === 'admin' || userLevel.levelUser === 'power') {
            await wos.update(req.body, { where: { WOS_number } });
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

router.delete("/wos", async (req, res) => {
    try {
        //check updater class
        let { updater, WOS_number } = req.body
        let userLevel = await user.findOne({ where: { username: updater } })
        if (userLevel.levelUser === 'admin' || userLevel.levelUser === 'power') {
            await wos.destroy({ where: { WOS_number } });
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