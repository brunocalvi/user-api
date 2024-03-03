const jwt = require("jsonwebtoken");
const secret = "zRGqjNM|[]o|*@aQ6>A^n20ch-Xq?g";

module.exports = function(req, res, next) {
  const authToken = req.headers['authorization'];

  if(authToken != undefined) {
    const bearer = authToken.split(" ");
    var token = bearer[1];

    try {
      let decoded = jwt.verify(token, secret);

      if(decoded.role == 1) {
        next();

      } else {
        res.status(401).json({status: 401, mensagem: `Falta de privilegios.`});
      }

    }catch(e) {
      res.status(401).json({status: 401, mensagem: `Erro ao gerar o token error: ${e}`});
    }
  
  } else {
    res.status(401).json({status: 401, mensagem: `Token inválido.`});
    return;
  }
}