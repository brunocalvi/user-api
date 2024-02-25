const User = require("../models/User");

class UserController {

  async index(req, res) {
    var users = await User.findAll();
    res.json(users);
    return;
  }

  async findUser(req, res) {
    var id = req.params.id;

    if(isNaN(id)) {
      res.status(405).json({error: "Tipo de dado inválido."});
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
      res.status(400).json({status: 400, error: "Indique um e-mail válido."});
      return;
    }

    if(password == undefined || password == " ") {
      res.status(400).json({status: 400, error: "Coloque uma senha."});
      return;
    }

    var emailExiste = await User.findEmail(email);
    if(emailExiste == true) {
      res.status(406).json({status: 400, error: "E-mail já está cadastrado."});
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
        res.status(404).json({status: 304, error: result.err});
        return;
      }
    } else {
      res.status(404).json({status: 304, error: "Falha interna."});
      return;
    }
  }

  async remove(req, res) {
    var id = req.params.id;
    var result = await User.delete(id);

    if(result.status == true) {
      res.status(200).json({status: 200, mensagem: "Usuário deletado com sucesso!"});

    } else {
      res.status(406).json({status: 406, error: result.err});
    }

  }
}

module.exports = new UserController();