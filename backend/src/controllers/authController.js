import { register, login } from "../services/authService.js";
import User from "../models/User.js";

export async function registerController(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const result = await register({ name, email, password, role });
    return res.status(201).json({ success: true, data: result.user, token: result.token });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });
    return res.status(200).json({ success: true, data: result.user, token: result.token });
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
  }
}

export async function getMeController(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuário não encontrado" });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
      },
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}
