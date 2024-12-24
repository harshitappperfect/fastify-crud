const { z } = require("zod");

const userSchema = z.object({
  name: z.string().min(4, "Min 4 char are required"),
  email: z.string().email("Invalid email address"),
});

module.exports = { userSchema };
