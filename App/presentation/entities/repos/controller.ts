import { Request, Response } from "express";
import ReposGetAllUseCase from "../../../domain/use-cases/repos/getall.use-case.js";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { CreateRepositorioDto } from "../../../domain/dto/repos/createRepos.dto.js";


export class ReposController{
    
    create = (req:Request,res:Response) =>{
        if(req.authpayload === undefined){
            CustomResponse.badRequest({res,error:"No tienes permisos"});
            return
        }

        const [error , createDto ] = CreateRepositorioDto.createRepositorio(req.body);

        if(error !== undefined || createDto === undefined ){
            CustomResponse.badRequest({res,error});
            return;
        }
        const repositorio = new ReposGetAllUseCase();
        const idUser = req.authpayload.idusuario || req.authpayload.id;
        if (!idUser) {
            CustomResponse.badRequest({res,error:"No se pudo obtener el ID del usuario"});
            return;
        }
        repositorio.create(createDto, idUser).then(data =>{
            CustomResponse.success({res,data});
        }).catch(error =>{
            CustomResponse.badRequest({res,error})
        })
    }

    getall = (req:Request,res:Response)=>{
        const repos = new ReposGetAllUseCase();
        repos.getAll().then(data=>{
            CustomResponse.success({res,data})  
        }).catch(error =>{
            CustomResponse.badRequest({res,error})
        })
    }

    getById = (req:Request,res:Response)=>{
        if(req.authpayload === undefined){
            CustomResponse.badRequest({res,error:"No tienes permisos"});
            return
        }

        const idRepos = Number(req.params.id);

        if(!idRepos){
            CustomResponse.badRequest({res,error:"Es olbigatorio el ID"})
            return
        }

        const reposId = new ReposGetAllUseCase();
        const idUser = req.authpayload.idusuario || req.authpayload.id;
        if (!idUser) {
            CustomResponse.badRequest({res,error:"No se pudo obtener el ID del usuario"});
            return;
        }
        console.log(` idUser: ${idUser} - idRepo : ${idRepos} `);
        reposId.getBiId(idUser,idRepos).then(data =>{
            CustomResponse.success({res,data});
        }).catch(error=>{
            CustomResponse.badRequest({res,error});
        })
    }

    unirseGroup = ( req:Request,res:Response)=>{
        if(req.authpayload === undefined){
            CustomResponse.badRequest({res,error:"No tienes permisos"})
            return
        }

        const body = req.body;

        if(!body.idRepositorio || !body.contra ){
            CustomResponse.badRequest({res,error:"el idRepositorio y la contra son obligatorios"
            });
            return
        }

        const idRepositorio = Number(body.idRepositorio);
        
        if(!idRepositorio){
            CustomResponse.badRequest({res,error:"Error de ID"})
        }

        const reposAdd = new ReposGetAllUseCase();
        const idUser = req.authpayload.idusuario || req.authpayload.id;
        if (!idUser) {
            CustomResponse.badRequest({res,error:"No se pudo obtener el ID del usuario"});
            return;
        }
        reposAdd.unirseRepo(idUser,idRepositorio,body.contra).then(data =>{
            CustomResponse.success({res,data})
        }).catch(error =>{
            CustomResponse.badRequest({res,error})
        })
    }

    getMyRepositories = (req:Request,res:Response)=>{
        if(req.authpayload === undefined){
            CustomResponse.badRequest({res,error:"No tienes permisos"});
            return
        }

        const idUser = req.authpayload.idusuario || req.authpayload.id;
        if (!idUser) {
            CustomResponse.badRequest({res,error:"No se pudo obtener el ID del usuario"});
            return;
        }
        
        const repos = new ReposGetAllUseCase();
        repos.miRepositori(idUser).then(data=>{
            CustomResponse.success({res,data})  
        }).catch(error =>{
            CustomResponse.badRequest({res,error})
        })
    }

}