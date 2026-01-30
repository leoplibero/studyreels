import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "studyreelsadm";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Token ausente" });
    }

    // Remove "Bearer " prefix se existir
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.i);
    if (!user) {
      return res.status(401).json({ success: false, message: "Usuário inválido" });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token inválido ou expirado" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Acesso negado" });
    }
    next();
  };
}
