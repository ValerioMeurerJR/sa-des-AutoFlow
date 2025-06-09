interface StatusForm {
    statusMotor: boolean;
    statusPneu: boolean;
    statusChassi: boolean;
    opcionais: {
        nome: string;
        status: boolean;
        idOpcionais: string;
        idProducao: string;
    }[];
}