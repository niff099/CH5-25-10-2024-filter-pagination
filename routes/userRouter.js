const router = require("express").Router();

const { userController } = require("../controllers");

// router.post("", userController.);
router.get("", userController.findUsers);
router.get("/pagination", userController.getPaginatedUsers);
router.get("/:id", userController.findUserById);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
