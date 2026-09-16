import connectToDatabase from "@/utils/mongoose";
import User from "@/models/User";
import { hashPassword } from "@/utils/auth";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    throw new Error("Unable to process request");
  }
  const { name, email, password } = req.body;

  await connectToDatabase();

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    res.status(500).json({ message: "unable to connect to database" });
  }

  if (existingUser) {
    res.status(400).json({ message: "entered email address is not available" });
  }

  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    email,
    name,
    password: hashedPassword,
  });

  try {
    await newUser.save();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "unable to save new user to database" });
  }

  res.status(201).json({ email, message: "User created!" });
};

export default handler;
