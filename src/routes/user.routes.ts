import { UserRepository } from "../repository/implementation/user.repository";
import _prisma from "../db/dbConn";
import { UserService } from "../services/implementation/user.service";

const userRepo = new UserRepository(_prisma)
const userService = new UserService(userRepo)