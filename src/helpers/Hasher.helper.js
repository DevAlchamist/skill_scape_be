const bcrypt = require("bcrypt");

class Hasher {
  getSalt = async (SALT_WORK_FACTOR) => {
    return await bcrypt.genSalt(SALT_WORK_FACTOR); // <-- async version
  };
  hash = async (password, SALT) => {
    return await bcrypt.hash(password, SALT); // <-- also make hash async
  };
  compare = async (newPass, currentPass) => {
    return await bcrypt.compare(newPass, currentPass);
  };
}

module.exports = new Hasher();
