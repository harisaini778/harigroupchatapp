// Import necessary models
const { Sequelize } = require('sequelize');
const {Op} = require("sequelize");
const Groups = require('../models/groupModel');
const UserGroup = require('../models/userGroup');
const Users = require('../models/userModel');

// Create Group Controller
// const createGroup = async (req, res) => {
//     const { name, admin, members } = req.body.groupData;

//     try {
//         // Create the group
//         const newGroup = await Groups.create({ name });

//         // Associate admins with the group using a normal for loop
     
//             // Check if the association already exists
//             const existingAssociation = await UserGroup.findOne({
//                 where: { userId: admin, groupId: newGroup.id }
//             });
//             if (!existingAssociation) {
//                 await UserGroup.create({ userId: admin, groupId: newGroup.id, isAdmin: true });
//             }


//         // Associate members with the group using a normal for loop
//         for (let j = 0; j < members.length; j++) {
//             // Check if the association already exists
//             const existingAssociation = await UserGroup.findOne({
//                 where: { userId: members[j], groupId: newGroup.id }
//             });
//             if (!existingAssociation) {
//                 await UserGroup.create({ userId: members[j], groupId: newGroup.id, isAdmin: false });
//             }
//         }

//         res.status(201).json({ message: 'Group created successfully' });
//     } catch (err) {
//         console.log('Error creating group:', err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

const createGroup = async (req, res) => {
    const { name, admin, members } = req.body.groupData;

    try {
        // Include admin in the members array if not already present
        if (!members.includes(admin)) {
            members.push(admin);
        }

        // Create the group
        const newGroup = await Groups.create({ name });

        // Associate admins and members with the group
        for (let i = 0; i < members.length; i++) {
            const userId = members[i];
            const isAdmin = userId === admin;

            // Check if the association already exists
            const existingAssociation = await UserGroup.findOne({
                where: { userId, groupId: newGroup.id }
            });

            if (!existingAssociation) {
                await UserGroup.create({ userId, groupId: newGroup.id, isAdmin });
            }
        }

        res.status(201).json({ message: 'Group created successfully' });
    } catch (err) {
        console.log('Error creating group:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getAllGroups = async (req,res) => {

    try {
    
    const {userId} = req.params;

    const data = await UserGroup.findAll({where : {userId:userId}});

    const groupIds = data.map((item)=>item.groupId);

    const groups = await Groups.findAll({where : {id : {
        [Sequelize.Op.in] : groupIds,
    }}})

    return res.status(200).json({groups:groups});

    }catch (err) {

        console.log(err);

        return res.status(500).json({message : "Unable to find groups", errMsg : err});

    }
}

// Get All Users Controller
const getAllUsers = async (req, res) => {

    try {
        
        const users = await Users.findAll({ attributes: ['id', 'name'] });
        res.status(200).json({ users });
    } catch (err) {
        console.log('Error fetching users:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createGroup,getAllGroups, getAllUsers };
