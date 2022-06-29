import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

class UserController {
  async findOne(req, res) {
    const id = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    console.log(user);
    return res.status(200).json(user);
  }

  async findAll(req, res) {
    const users = await prisma.user.findMany();
    if (users) {
      return res.status(200).send(users);
    }
    return res.status(404).send({ error: "Users not found" });
  }

  async createUser(req, res) {
    const { name, email, password } = req.body;
    if (!email) {
      return res.status(400).send({ error: "The email field must be filled" });
    }

    if (!password) {
      return res
        .status(400)
        .send({ error: "The password field must be filled" });
    }
    //Verificando se o usuário existe
    const UserExistVerify = await prisma.user.findUnique({
      where: { email },
    });
    if (UserExistVerify) {
      return res.status(409).send({ error: "Existing User" });
    }

    // Caso não exista ele cria o usuário
    const salt = await bcrypt.genSalt(8);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });
    return res.status(201).send({ success: "User created successfully" });
  }

  async UserAuth(req, res) {
    const { email, password } = req.body;

    // Verifica se o usuário preencheu os campos corretamente
    if (!email) {
      return res.status(400).send({ error: "The email field must be filled" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ error: "The password field must be filled" });
    }

    // Verifica se existe usuário no banco com as informações passadas
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(203).send({ error: "User not found" });
    }

    // Verifica se as senhas correspondem
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(404).send({ error: "The credentials are incorrect" });
    }

    try {
      const secret = process.env.SECRET;
      const token = jwt.sign(
        {
          id: user.id,
        },
        secret
      );

      return res
        .status(200)
        .send({ success: "Successfully Authenticated", token });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ error: "The server encountered an error, try later" });
    }
  }

  async updateUser(req, res) {
    const id = req.params;
    const { email, name, password } = req.body;

    // Verificando se o usuário existe
    const UserExistVerify = prisma.user.findUnique({ where: id });
    if (!UserExistVerify) {
      return res.status(203).send({ error: "User not found" });
    }

    try {
      const salt = await bcrypt.genSalt(8);
      const passwordHash = await bcrypt.hash(password, salt);
      const updateUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: "Viola the Magnificent",
          email: "teste@tese.com",
          password: "Viola the Magnificent",
        },
      });
      return res.status(201).send({ success: "User successfully updated" });
    } catch (error) {
      // console.log(error);
      res
        .status(500)
        .send({ error: "The server encountered an error, try later" });
    }
  }
}

export default new UserController();
