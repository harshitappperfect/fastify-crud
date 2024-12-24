const fastify = require("fastify")();
const { PrismaClient } = require("@prisma/client");
const { userSchema } = require("./schemas/user");
const { postSchema } = require("./schemas/post");
const prisma = new PrismaClient();

fastify.post("/users", async (request, reply) => {
  try {
    const parsed = userSchema.parse(request.body);

    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
      },
    });

    reply.send(user);
  } catch (error) {
    console.log(error);
    reply.send(error.message);
  }
});

fastify.get("/users", async (request, reply) => {
  const users = await prisma.user.findMany();

  //   return users;
  reply.send(users); // alter
});

fastify.get("/users/:id", async (request, reply) => {
  try {
    const { id } = request.params;
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    reply.send(user);
  } catch (error) {
    reply.send(error);
    console.log(error);
  }
});

fastify.put("/users/:id", async (request, reply) => {
  try {
    userSchema.parse(request.body);
    const { id } = request.params;
    const { name, email } = request.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email },
    });

    reply.send(user);
  } catch (error) {
    reply.send(error);
    console.log(error);
  }
});

fastify.delete("/users/:id", async (request, reply) => {
  try {
    const { id } = request.params;
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    reply.send({ message: " USer deletede " });
  } catch (error) {
    console.log(error);
    reply.send(error);
  }
});

fastify.post("/users/:id/posts", async (request, reply) => {
  try {
    const parsed = postSchema.parse(request.body);
    const { id: userId } = request.params;

    const post = await prisma.post.create({
      data: {
        title: parsed.title,
        content: parsed.content,
        userId: parseInt(userId),
      },
    });

    reply.send(post);
  } catch (error) {
    console.log(error);
    reply.send(error.message);
  }
});

fastify.get("/users/:id/posts", async (request, reply) => {
  try {
    const { id: userId } = request.params;

    const posts = await prisma.post.findMany({
      where: { userId: parseInt(userId) },
      include: { user: true },
    });
    reply.send({ message: "Post fetched", posts });
  } catch (error) {
    console.log(error);
    reply.send(error);
  }
});

fastify.put("/users/:id/posts/:postId", async (request, reply) => {
  try {
    postSchema.parse(request.body);
    const { postId } = request.params;
    const { title, content } = request.body;

    const updatedData = await prisma.post.update({
      where: { id: parseInt(postId) },
      data: { title, content },
    });

    reply.send(updatedData);
  } catch (error) {
    console.log(error);
    reply.send(error);
  }
});

fastify.delete("/users/:id/posts/:postId", async (request, reply) => {
  try {
    const { postId } = request.params;

    const data = await prisma.post.delete({
      where: { id: parseInt(postId) },
    });

    reply.send("Deleted");
  } catch (error) {
    console.log(error);
    reply.send(error);
  }
});

// fastify.get("/", (request, reply) => {
//   return "Hello, this is harshit";
// });

// fastify.get("/user/:name", async (request, reply) => {
//   const { name } = request.params.name;

//   return { message: `Hello, ${name}` };
// });

// fastify.post("/user", async (request, reply) => {
//   try {
//     const { title, desc } = request.body;

//     const data = await prisma.post.create({
//       data: {
//         title,
//         desc,
//       },
//     });
//     return { message: "post created successfully", data };
//   } catch (error) {
//     console.log(error);
//   }
// });

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Server listening on http://localhost:3000");
  } catch (error) {
    fastify.log.error(error);
  }
};

start();
