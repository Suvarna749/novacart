import jwt from 'jsonwebtoken';
export function requireAuth(req,res,next){
 const header=req.headers.authorization;const token=header?.startsWith('Bearer ')?header.slice(7):req.cookies?.nova_token;
 if(!token)return res.status(401).json({message:'Please sign in to continue.'});
 try{req.user=jwt.verify(token,process.env.JWT_SECRET);next()}catch{return res.status(401).json({message:'Your session is invalid or expired. Please sign in again.'})}
}
export function requireAdmin(req,res,next){if(req.user?.role!=='ADMIN')return res.status(403).json({message:'Administrator access required.'});next()}
