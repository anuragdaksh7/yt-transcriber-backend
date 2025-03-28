import type { User } from "@prisma/client";
import type { UserRepository } from "../../repository/implementation/user.repository";
import { generateVerificationCode } from "../../utils/generateVerificationCode";
import type { CreateUserService, UserServiceContract } from "../contracts/user.service.contract";

class UserService implements UserServiceContract {
  private userRepository: UserRepository;
  constructor( _userRepository: UserRepository ) {
    this.userRepository = _userRepository
  }

  create = async ({
    email,
    first_name,
    last_name,
    provider,
    verified,
    image_url
  }: CreateUserService): Promise<User> => {
    try {
      const verification_code = `${generateVerificationCode()}`;

      const user = await this.userRepository.create({
        email,
        first_name,
        last_name,
        provider,
        verified,
        image_url,
        verification_code
      })
      return user;
    } catch (error: any) {
      throw new Error(error)
    }
  }
}

export {
  UserService
}