const { where } = require("sequelize");
const { Users } = require("../models");
const { Op } = require("sequelize");

const getPaginatedUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const queries = {
      offset: (page - 1) * limit,
      limit,
    };

    const users = await Users.findAndCountAll({
      ...queries,
      attributes: ["id", "name", "age", "role", "address"],
    });

    const data = {
      totalPage: Math.ceil(users?.count / limit),
      totalData: users?.count,
      users: users?.rows,
    };

    res.status(200).json({
      status: "Success",
      data,
    });
  } catch (err) {}
};

const findUsers = async (req, res, next) => {
  try {
    const { userName, age, role } = req.query;

    const condition = {};

    if (userName) condition.name = { [Op.iLike]: `%${userName}%` };
    if (age) condition.age = age;
    if (role) condition.role = role;

    const users = await Users.findAll({
      attributes: ["name", "age", "role", "address"],
      where: condition,
    });

    const totalData = users.length;
    console.log(totalData);

    res.status(200).json({
      status: "Success",
      data: {
        totalData,
        users,
      },
    });
  } catch (err) {
    console.log(error.name);
    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((err) => err.message);
      return res.status(400).json({
        status: "Failed",
        message: errorMessage[0],
        isSuccess: false,
        data: null,
      });
    }

    res.status(500).json({
      status: "Failed",
      message: error.message,
      isSuccess: false,
      data: null,
    });
  }
};

const findUserById = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (err) {}
};

const updateUser = async (req, res, next) => {
  const { name, age, role, address, shopId } = req.body;
  try {
    await Users.update(
      {
        name,
        age,
        role,
        address,
        shopId,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      status: "Success",
      message: "sukses update user",
    });
  } catch (err) {}
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });

    await Users.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "sukses delete user",
    });
  } catch (err) {}
};

module.exports = {
  findUsers,
  findUserById,
  updateUser,
  deleteUser,
  getPaginatedUsers,
};
