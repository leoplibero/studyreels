import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "studyreelsadm_default_key";

export async function register({ name, email, password, role = "student" }) {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("E-mail já cadastrado");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role, xp: 0, level: 1 });

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  return { user: sanitizeUser(user), token };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Credenciais inválidas");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Credenciais inválidas");

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  return { user: sanitizeUser(user), token };
}

function sanitizeUser(u) {
  return { id: u._id, name: u.name, email: u.email, role: u.role, xp: u.xp, level: u.level };
}
