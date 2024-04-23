const express = require("express");
const router = express.Router();
const {Op} = require("sequelize");
const UserGroups = require("../models/userGroup");
const Users = require("../models/userModel");
const {Sequelize} = require("sequelize");

const getAllNewMembers = async (req, res) => {
  try {
    const groupId = req.params.groupId; // Assuming the parameter is named groupId

    const allMembers = await UserGroups.findAll({ where: { groupId: groupId } });

    console.log(allMembers);

    const userIds = allMembers.map((member) => member.userId);

    const newMembersToAdd = await Users.findAll({
      where: {
        id: {
          [Sequelize.Op.notIn]: userIds,
        },
      },
    });

    res.status(200).json({ newMembersToAdd });
  } catch (err) {
    console.log("Error fetching new members:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {getAllNewMembers};
