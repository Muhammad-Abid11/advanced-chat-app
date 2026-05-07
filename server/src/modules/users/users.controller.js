import { User } from "./users.model.js";

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching users" });
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user" });
    }
}

export { getAllUsers, getUserById }