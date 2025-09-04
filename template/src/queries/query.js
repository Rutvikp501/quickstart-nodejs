export const getAllUsers = async (req, res) => {
  try {
    const existingUsers = await User.find().select("-password");
    res.json(existingUsers);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching Users", error: err.message });
  }
};