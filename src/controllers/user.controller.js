import { usersService } from "../repositoryServices/index.js";
import passport from "passport";
import mongoose from "mongoose";
import CustomError from "../errors/error.generator.js";
import { ErrorMessages, ErrorName } from "../errors/errors.enum.js";
import { logger } from "../utils/logger.js";


export const findUserById = (req, res) => {
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try{
            const { idUser } = req.params;
            const user = await usersService.findById(idUser);
            if (!user) {
                    logger.warning("User not found with the id provided")   
                    return CustomError.generateError(ErrorMessages.USER_NOT_FOUND,404, ErrorName.USER_NOT_FOUND);
                }
            res.json({ message: "User", user });
        }catch (error){
            logger.error(error)
            next(error)
        }
}};

export const findUserByEmail = async (req, res) => {
    try {
        const { UserEmail } = req.body;        
        const user = await usersService.findByEmail(UserEmail);
        if (!user) {
            logger.warning("User not found with the email provided")
            return CustomError.generateError(ErrorMessages.USER_NOT_FOUND,404, ErrorName.USER_NOT_FOUND);
        }
        res.status(200).json({ message: "User found", user });
    } catch (error) {
        logger.error(error)
        next(error)
    }
    
};

export const createUser =  async (req, res) => {
    try{
        const { name, lastName, email, password } = req.body;
        if (!name || !lastName || !email || !password) {
            logger.warning("Some data is missing")
            return CustomError.generateError(ErrorMessages.MISSING_DATA,400, ErrorName.MISSING_DATA);
        }
        const createdUser = await usersService.createOne(req.body);
        res.status(200).json({ message: "User created", user: createdUser });
    }catch (error){
        logger.error(error)
        next(error)
    }    
};


export const roleSwapper = async (req, res, next) => {
    const { idUser } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(idUser)) {
            logger.warning("Invalid Mongoose ObjectID format");
            return CustomError.generateError(ErrorMessages.OID_INVALID_FORMAT, 404, ErrorName.OID_INVALID_FORMAT);
        }

        const user = await usersService.findById(idUser);

        if (!user) {
            logger.warning("User not found with the id provided");
            return CustomError.generateError(ErrorMessages.USER_NOT_FOUND, 404, ErrorName.USER_NOT_FOUND);
        }

        const requiredDocuments = ["Identification", "AddressProof", "BankStatement"];
        const userDocuments = user.documents.map(doc => doc.name);

        const hasAllDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));

        if (hasAllDocuments) {
            let roleChange;
            if (user.role === 'PREMIUM') {
                roleChange = { role: 'USER' };
            } else if (user.role === 'USER') {
                roleChange = { role: 'PREMIUM' };
            }

            await usersService.updateUser(user.email, roleChange);
            const updatedUser = await usersService.findById(idUser);
            res.json({ message: "Role updated", user: updatedUser });
        } else {
            res.status(400).json({ error: "El usuario no ha cargado todos los documentos necesarios" });
        }
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

    export const saveUserDocuments = async (req, res) => {
        const { idUser } = req.params;
        console.log(req.files); 
        const { dni, address, bank } = req.files;
        const response = await usersService.saveUserDocumentsService({ idUser, dni, address, bank });
        res.json({ response });
      };
