import { createRepositorioValidator } from "../../validators/repos/reposValidate.js";

export class CreateRepositorioDto {
    public nombrerepo: string;
    public descripcion: string;
    public ipdata: string;
    public portdata: string;
    public dominio: string;
    public orgdata: string;
    public contrarepo: string;


    private constructor({
        nombrerepo,
        contrarepo,
        descripcion,
        dominio,
        ipdata,
        orgdata,
        portdata 
    }:CreateRepositorioDto) {
        this.nombrerepo = nombrerepo;
        this.descripcion = descripcion;
        this.contrarepo = contrarepo;
        this.dominio = dominio;
        this.ipdata = ipdata;
        this.orgdata = orgdata;
        this.portdata = portdata;

    }

    static createRepositorio(input:any): [string?,CreateRepositorioDto? ]{
        const responses = createRepositorioValidator(input);

        if(!responses.success){
            return [responses.error.message,undefined];
        }
        return [undefined, new CreateRepositorioDto(responses.data)]
    }

}