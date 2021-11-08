const express = require("express");
const router = express.Router();
const constants = require("./../constant/constant");
const sequelize = require("sequelize");

//models
const bom = require('../database/model/bill_of_materials');
const user = require("./../database/model/user");

router.get("/bom", async (req, res) => {
    try {
        const bom_model_list = await bom.sequelize.query(`
        WITH tableA as (
            SELECT DISTINCT("model_number") AS "model_number"
            FROM "bill_of_materials" AS "bill_of_material"
        )
        select
            tableA."model_number",
            public."model_masters"."model_name"
        from tableA join public."model_masters"
        on tableA."model_number" = public."model_masters"."model_number";
        `, { type: sequelize.QueryTypes.SELECT })

        let expandableBomList = []
        for (let index = 0; index < bom_model_list.length; index++) {
            const model_number = bom_model_list[index].model_number;
            const bom_result = await bom.sequelize.query(`
            SELECT model_number,
                    public.bill_of_materials.material_number,
                    material_name,
                    unit_of_measure,
                    public.bill_of_materials."usage",
                    public.bill_of_materials.updater,
                    public.bill_of_materials."createdAt",
                    public.bill_of_materials."updatedAt"
                FROM public.bill_of_materials join public.material_masters
                on public.bill_of_materials.material_number = public.material_masters.material_number
                where model_number = '${model_number}';
        `, { type: sequelize.QueryTypes.SELECT })
            expandableBomList.push(bom_result)
        }

        res.json({
            bom_model_list,
            expandableBomList,
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

router.get("/find_bom/:model_number", async (req, res) => {
    try {
        const { model_number } = req.params;
        const bom_model_list = await bom.sequelize.query(`
        WITH tableA as (
            SELECT DISTINCT("model_number") AS "model_number"
            FROM "bill_of_materials" AS "bill_of_material"
        )
        select
            tableA."model_number",
            public."model_masters"."model_name"
        from tableA join public."model_masters"
        on tableA."model_number" = public."model_masters"."model_number"
        where tableA."model_number" LIKE '%${model_number}%';
        `, { type: sequelize.QueryTypes.SELECT })

        let expandableBomList = []
        for (let index = 0; index < bom_model_list.length; index++) {
            const model_number = bom_model_list[index].model_number;
            const bom_result = await bom.sequelize.query(`
            SELECT model_number,
                    public.bill_of_materials.material_number,
                    material_name,
                    unit_of_measure,
                    public.bill_of_materials."usage",
                    public.bill_of_materials.updater,
                    public.bill_of_materials."createdAt",
                    public.bill_of_materials."updatedAt"
                FROM public.bill_of_materials join public.material_masters
                on public.bill_of_materials.material_number = public.material_masters.material_number
                where model_number = '${model_number}';
        `, { type: sequelize.QueryTypes.SELECT })
            expandableBomList.push(bom_result)
        }

        res.json({
            bom_model_list,
            expandableBomList,
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