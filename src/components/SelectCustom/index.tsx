"use client"
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import "./styles.css"



type SelectProps = {
    texto: string,
    message: string,
    setMessage: (value: string) => void,
    option: any[]
}

export function SelectCustom({ texto, message, setMessage, option }: SelectProps) {
    return (
        <FormControl fullWidth>
            <InputLabel>{texto}</InputLabel>
            <Select
                id="input"
                value={message}
                onChange={(e) => { setMessage(e.target.value) }}
            >
                {
                    option.map(value => <MenuItem value={value.id ? value.id : value.item} key={value.id}>{value.nome ? value.nome : value.item}</MenuItem>)
                }
            </Select>
        </FormControl>
    )
}

{/* <div className="div-Input-Custom">
<select
    id="input"
    value={message}
    onChange={(e) => { setMessage(e.target.value) }}               
>
    <option>{texto}</option>
    {
        option.map(value => <option value={value.value ? value.value : value.item} key={value.item}>{value.item}</option>)
    }
</select>
</div> */}