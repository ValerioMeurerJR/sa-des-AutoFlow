
type ProducaoOpcionais = {
    nome: string,
    Status: boolean,
    idOpcionais: string,
    idProducao: string
}


type CarProduction = {
    id: string,
    nome: string,
    modeloId: string,
    cor: string,
    quantidade: number,
    statusMotor: boolean,
    statusPneu: boolean,
    statusChassi: boolean,
    createDate: Date,
    updatedAt: Date,
    ProducaoOpcionais: ProducaoOpcionais[],
    Modelos: {
        modelo: string
    },
    modelo: string,
    status: string
}

type Opcionais = {
    id: string,
    nome: string
}