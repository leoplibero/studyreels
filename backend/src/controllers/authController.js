import { register, login } from "../services/authService.js";

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
