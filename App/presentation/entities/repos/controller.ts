import { Request, Response } from "express";
import ReposGetAllUseCase from "../../../domain/use-cases/repos/getall.use-case.js";
import { CustomResponse } from "../../../core/res/custom.response.js";


export class ReposController{
    
    getall(req:Request,res:Response){
        const repos = new ReposGetAllUseCase();
        repos.getAll().then(data=>{
            CustomResponse.success({res,data})  
        }).catch(error =>{
            CustomResponse.badRequest({res,error})
        })
    }

    getById(req:Request,res:Response){
        const id = req.params;
        console.log(req.params);
    }

}