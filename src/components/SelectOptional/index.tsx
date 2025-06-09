import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";


type SelectOptional = {
    selected: string[];
    onSelect: (value: string[]) => void;
    optionais: Opcionais[];
};

export default function SelectOptional({ optionais, selected, onSelect }: SelectOptional) {
    const handleChange = (event: any) => {
        const {
            target: { value },
        } = event;
        onSelect(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <FormControl sx={{ display: 'flex', flex: 1 }}>
            <InputLabel>Selecione Opcionais</InputLabel>
            <Select
                multiple
                value={selected}
                onChange={handleChange}
                input={<OutlinedInput label="Selecione Opcionais" />}
                renderValue={(selectedIds) => (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {selectedIds.map((id: string) => {
                            const opcional = optionais.find(opt => opt.id === id);
                            return (
                                <Chip key={id} label={opcional ? opcional.nome : id} />
                            );
                        })}
                    </Box>
                )}
            >
                {optionais.map((opcional: Opcionais) => (
                    <MenuItem
                        key={opcional.id}
                        value={opcional.id}
                    >
                        {opcional.nome}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
