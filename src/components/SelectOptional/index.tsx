import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";

type SelectOptional = {
    selected: string[];
    onSelect: (value: string[]) => void;
    optionais: string[]
}
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
        <FormControl sx={{ display: 'flex', flex: 1}}>
            <InputLabel>Selecione Opcionais</InputLabel>
            <Select
                multiple
                value={selected}
                onChange={handleChange}
                input={<OutlinedInput label="Selecione Opcionais" />}
                renderValue={(value) => (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {value.map((select) => (
                            <Chip key={select} label={select} />
                        ))}
                    </Box>
                )}
            >
                {optionais.map((name) => (
                    <MenuItem
                        key={name}
                        value={name}
                    >
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}