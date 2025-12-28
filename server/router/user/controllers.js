const userByEmail = async (req, res) => {
  try {
    // check for cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // check token validation
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check valid user in db
    const userEmail = decoded.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // after all checks, proceed to
    // give requested data
    const userEmailQuery = req.body.email;

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmailQuery)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const findUser = await User.findOne({ email: userEmailQuery });
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(findUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// delete the user
const deleteUser = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const deletedUser = await User.findOneAndDelete({ email: userEmail });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { userByEmail, deleteUser };
