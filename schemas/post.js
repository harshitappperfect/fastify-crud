const { z } = require("zod");

const postSchema = z.object({
  title: z.string().min(4, "Title must be at least 3 characters long"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
});

module.exports = { postSchema };
