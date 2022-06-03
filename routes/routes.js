
var router = require("express").Router();
const controller = require("../Controller/controller");

router.get("/totalSupply", controller.totalSupply);
router.get("/balanceOf", controller.balanceOf);
router.post("/transfer", controller.transfer);
router.get("/approve", controller.approve);
router.post("/allowance", controller.allowance);
router.get("/alltransction",controller.alltransction);
 

module.exports  = router;
