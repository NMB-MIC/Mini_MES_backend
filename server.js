const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const json2xls = require('json2xls');
const { getToken, verifyToken } = require('./passport/jwtHandler');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "100mb", extended: false }));
app.use(json2xls.middleware);
app.use(express.static(path.join(__dirname, "./files")));
app.use(cors());

app.use("/api/mini_mes/authen/", require("./api/api_authen"));
app.use("/api/mini_mes/manage_user/", verifyToken, require("./api/api_manage_user"));
app.use("/api/mini_mes/bill_of_material/", verifyToken, require("./api/api_bill_of_materials"));
app.use("/api/mini_mes/materials_master/", verifyToken, require("./api/api_materials_master"));
app.use("/api/mini_mes/models_master/", verifyToken, require("./api/api_models_master"));
app.use("/api/mini_mes/manufacturing_order/", verifyToken, require("./api/api_manufacturing_order"));
app.use("/api/mini_mes/work_order_sheet/", verifyToken, require("./api/api_work_order_sheet"));

app.listen(2008, () => {
  console.log("Backend is running...");
});
