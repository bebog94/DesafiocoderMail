import { usersManager } from "../DAL/dao/managers/usersManager.js";
import { cartsManager } from "../DAL/dao/managers/cartsManager.js";
import UsersResponseDto from "../DAL/dtos/user-response.dto.js"
import UsersRequestDto from "../DAL/dtos/user-request.dto.js"
import {hashData} from "../utils/utils.js"

export default class UsersRepository {
    
    async findById(id) {
        const user = usersManager.findById(id);
        const userDTO = new UsersResponseDto(user);
        return userDTO;
    }

    async findByEmail(id) {
        const user = usersManager.findByEmail(id);
        const userDTO = new UsersResponseDto(user);
        return userDTO;
    }

    async createOne(user) {
      const hashPassword = await hashData(user.password);
      const createdCart = await cartsManager.createCart()
      const userDto = new UsersRequestDto(
        { ...user, 
          cart: createdCart._id,
          password: hashPassword });
      
      const createdUser = await usersManager.createUser(userDto);
      return createdUser;
    }    
    async saveUserDocumentsService ({ id, dni, address, bank }) {
      const savedDocuments = await uManager.updateUser(id, {
        documents: [
          ...dni?[{
              name: "dni",
              reference: dni[0].path,
          }]:[],
          ...address?[{
              name: "address",
              reference: address[0].path,
          }]:[],
          ...bank?[{
              name: "bank",
              reference: bank[0].path,
          }]:[],
        ],
      });
      return savedDocuments;
    }


}
