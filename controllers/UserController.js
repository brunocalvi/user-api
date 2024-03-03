const User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secret = "zRGqjNM|[]o|*@aQ6>A^n20ch-Xq?g";

class UserController {

  async index(req, res) {
    var users = await User.findAll();
    res.json(users);
    return;
  }

  async findUser(req, res) {
    var id = req.params.id;

    if(isNaN(id)) {
      res.status(405).json({mensagem: "Tipo de dado inválido."});
      return;
    }

    var user = await User.findById(id);

    if(user == undefined) {
      res.status(404).json({mensagem: "Nenhum usuário foi encontrado."});
      return;

    } else {
      res.status(200).json(user);
      return;
    }
  }

  async create(req, res) {
    var {email, name, password} = req.body;

    var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email == undefined || email == " " || !regexEmail.test(email)) {
      res.status(400).json({status: 400, mensagem: "Indique um e-mail válido."});
      return;
    }

    if(password == undefined || password == " ") {
      res.status(400).json({status: 400, mensagem: "Coloque uma senha."});
      return;
    }

    var emailExiste = await User.findEmail(email);
    if(emailExiste == true) {
      res.status(406).json({status: 400, mensagem: "E-mail já está cadastrado."});
      return;
    }

    await User.new(email, password, name);
    res.status(200).json({status: 200, mensagem: "Cadastrao com sucesso."});
    return;
  }

  async edit(req, res) {
    var {id, name, role, email} = req.body;
    var result = await User.update(id, email, name, role);

    if(result != undefined) {
      if(result.status) {
        res.status(200).json({status: 200, mensagem: "Usuário atualizado com sucesso!"});
        return;
      } else {
        res.status(404).json({status: 304, mensagem: result.err});
        return;
      }
    } else {
      res.status(404).json({status: 304, mensagem: "Falha interna."});
      return;
    }
  }

  async remove(req, res) {
    var id = req.params.id;
    var result = await User.delete(id);

    if(result.status == true) {
      res.status(200).json({status: 200, mensagem: "Usuário deletado com sucesso!"});

    } else {
      res.status(406).json({status: 406, mensagem: result.err});
    }

  }

  async recoverPassword(req, res) {
    var email = req.body.email;

    var result = await PasswordToken.create(email);

    if(result.status == true) {
      res.status(200).json({status: 200 ,mensagem: "Token de recuperação gerado com sucesso.", token: result.token});

    } else {
      res.status(406).json({status: 406, mensagem: "Falha ao gerar o Token."});

    }
  }

  async chagePassword(req, res) {
    var token = req.body.token;
    var password = req.body.password;

    var isTokenValid = await PasswordToken.validate(token);

    if(isTokenValid.status) {
      await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
      res.status(200).json({status: 406, mensagem: "Senha alterada!"});

    } else {
      res.status(406).json({status: 406, mensagem: "Token inválido!"});

    }
  }

  async login(req, res) {
    var {email, password} = req.body;

    let user = await User.findByEmail(email);

    if(user != undefined) {
      let resultado = await bcrypt.compare(password, user.password);

      if(resultado == true) {
        var token = jwt.sign({ email: user.email, role: user.role }, secret);
        res.status(200).json({status: 200, mensagem: "Usuário validado", token: token});

      } else {
        res.status(406).json({status: 406, mensagem: "Senha incorreta."});
      }
    } else {
      res.status(406).json({status: 406, mensagem: "usuário não foi encontrado."});
    }
  }
  
  
}

module.exports = new UserController();