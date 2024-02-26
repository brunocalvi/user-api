var knex = require("../database/connection");
var User = require("./User");

class PasswordToken {
  async create(email) {
    let user = await User.findByEmail(email);

    if(user != undefined) {
      try {
        var token = Date.now();

        await knex.insert({
          user_id: user.id,
          used: 0,
          token: token //UUID
        }).table("passwordtokens");

        return {status: true, token: token};

      } catch(e) {
        console.log(e);
        return {status: false, err: e};
      }

    } else {
      return {status: false, err: "O e-mail não esta cadastrado!"};
    }
  }

  async validate(token) {
    try {
      var result = await knex.select().where({token: token}).table("passwordtokens");

      if(result.length > 0) {
        var tk = result[0];

        if(tk.used) {
          return {status: false};

        } else {
          return {status: true, token: tk};

        }
      } else {
        return {status: false};

      }
    }catch(e) {
      console.log(e);
      return {status: false};

    }
  }

  async setUsed(token) {
    await knex.update({used: 1}).where({token :token}).table("passwordtokens");
  }

}

module.exports = new PasswordToken();