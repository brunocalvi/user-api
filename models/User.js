const knex = require("../database/connection");
const bcrypt = require("bcrypt");

class User {
  async findAll() {
    try {
      var result = await knex.select(["id", "email", "role", "name"]).table("users");
      return result;

    } catch(e) {
      console.log(e);
      return [];
    }
  }

  async findById(id) {
    try {
      var result = await knex.select(["id", "email", "role", "name"]).where({id: id}).table("users");
    
      if(result.length > 0) {
        return result[0];

      } else {
        return undefined;
      }

    } catch(e) {
      console.log(e);
      return undefined;
    }
  }

  async new(email, password, name) {
    try {
      var hash = await bcrypt.hash(password, 10);
      await knex.insert({email, password: hash, name, role: 0}).table("users");

    } catch(e) {
      console.log(e);
    } 
  }

  async findEmail(email) {
    try {
      var result = await knex.select("*").from("users").where({email: email});
      if(result.length > 0) {
        return true;
      } else {
        return false;
      }

    } catch(e) {
      console.log(e);
      return false;
    }
  }

  async update(id, email, name, role) {
    var user = await this.findById(id);

    if(user != undefined) {
      var editUser = {};

      if(email != undefined) {
        if(email != user.email) {
          var result = await this.findEmail(email);
          if(result == false) {
            editUser.email = email;
          } else {
            return {status: false, err: "E-mail já está cadastrado!"};
          }
        }
      }

      if(name != undefined) {
        editUser.name = name;
      }

      if(role != undefined) {
        editUser,role = role;
      }
      
      try {
        await knex.update(editUser).where({id: id}).table("users");
        return {status: true};

      } catch(e) {
        console.log(e);
        return {status: false, err: e};
      }
      

    } else {
      return {status: false, err: "Ousuário não existe!"}
    }
  }

  async delete(id) {
    var user = await this.findById(id);

    if(user != undefined) {
      try {
        await knex.delete().where({id: id}).table("users");
        return {status: true};

      } catch(e) {
        return {status: false, err: e};
      }
    } else {
      return {status: false, err: "O usuário não exites."};
      
    }
  }
}

module.exports = new User()