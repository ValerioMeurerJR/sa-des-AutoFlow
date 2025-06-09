import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup
} from '@mui/material';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
const host = "http://localhost:3333"

interface Props {
    open: boolean;
    onClose: () => void;
    carId: string;
    setFormState: React.Dispatch<React.SetStateAction<StatusForm>>;
    formState: StatusForm;
    labelC: string
    labelF: string
    handleSubmit: (_id: string) => void;
}

const AtualizarStatusDialog: React.FC<Props> = ({ open, onClose, carId, setFormState, formState, handleSubmit, labelC, labelF }: Props) => {
    const [car, setCar] = useState<CarProduction | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${host}/production/${carId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            });
            setCar(data);
            setFormState({
                statusMotor: data.statusMotor,
                statusPneu: data.statusPneu,
                statusChassi: data.statusChassi,
                opcionais: data.ProducaoOpcionais.map((item: ProducaoOpcionais) => ({
                    nome: item.nome,
                    status: item.Status,
                    idOpcionais: item.idOpcionais,
                    idProducao: item.idProducao
                }))
            });
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
        setLoading(false);
    };

    const handleStatusChange = (field: string, value: boolean) => {
        setFormState((prev: StatusForm) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleOpcionalChange = (index: number, value: boolean) => {
        const updated = [...formState.opcionais];
        updated[index].status = value;
        setFormState((prev: StatusForm) => ({
            ...prev,
            opcionais: updated
        }));
    };

    if (loading) {
        return (
            <Dialog open={open} onClose={onClose}>
                <DialogContent>
                    <CircularProgress />
                </DialogContent>
            </Dialog>
        );
    }

    if (!car) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Revisão de Itens Obrigatórios</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <FormControl component="fieldset">
                            <FormLabel>Status Motor</FormLabel>
                            <RadioGroup
                                value={formState.statusMotor}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleStatusChange('statusMotor', e.target.value === 'true')}
                            >
                                <FormControlLabel value="false" control={<Radio />} label={`❌ ${labelF}`} />
                                <FormControlLabel value="true" control={<Radio />} label={`✅ ${labelC}`} />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl component="fieldset">
                            <FormLabel>Status Pneu</FormLabel>
                            <RadioGroup
                                value={formState.statusPneu}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleStatusChange('statusPneu', e.target.value === 'true')}
                            >
                                <FormControlLabel value="false" control={<Radio />} label={`❌ ${labelF}`} />
                                <FormControlLabel value="true" control={<Radio />} label={`✅ ${labelC}`} />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl component="fieldset">
                            <FormLabel>Status Chassi</FormLabel>
                            <RadioGroup
                                value={formState.statusChassi}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleStatusChange('statusChassi', e.target.value === 'true')}
                            >
                                <FormControlLabel value="false" control={<Radio />} label={`❌ ${labelF}`} />
                                <FormControlLabel value="true" control={<Radio />} label={`✅ ${labelC}`} />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    {formState.opcionais.map((item, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <FormControl component="fieldset">
                                <FormLabel>{item.nome}</FormLabel>
                                <RadioGroup
                                    value={item.status}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOpcionalChange(index, e.target.value === 'true')}
                                >
                                    <FormControlLabel value="false" control={<Radio />} label={`❌ ${labelF}`} />
                                    <FormControlLabel value="true" control={<Radio />} label={`✅ ${labelC}`} />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={() => handleSubmit(car.id)} variant="contained" color="primary">
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AtualizarStatusDialog;
