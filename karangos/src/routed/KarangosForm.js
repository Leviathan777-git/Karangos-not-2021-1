import React from 'react';
import { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputMask from 'react-input-mask';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Button, Toolbar } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles(() => ({
    form: {
        // backgroundColor: 'green', //cor debug
        maxWidth: '90%', // or 80%
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        '& .MuiFormControl-root': {
            minWidth: '200px',
            maxWidth: '500px',
            marginBottom: '24px',
            //backgroundColor: 'green',
        },
    },

    toolbar: {
        marginTop: '36px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
    },

    checkbox: {
        alignItems: 'center'
    },
}))

/*  Classes de caracteristi de entrada para o campo placa
    1) tres primeiras posiçoes: qualquer leatra, de A a Z =>[A-Z]
    2) Poiçoes numericas (1ª, a 3ª e a 4ª depois dotraço) => [0-9]
    3) 2º posição após o traço: pode receber digitos ou letras de A a J => [0-9 A-J]
*/

// Representando as classes de carcteres da mascara como um objeto
const formatChars = {
    'A': '[A-Za-z]',
    '0': '[0-9]',
    '#': '[0-9A-Ja-j]',
}

// Finalmente, a mascra de entrada do campo placa
const placaMask = 'AAA-0#00'

// Mascara para CPF: '000.000.000-00'

export default function KarangosForm() {

    const classes = useStyles()

    const [karango, setKarango] = useState({
        id: null,
        marca: '',
        modelo: '',
        cor: '',
        ano_fabricacao: (new Date()).getFullYear(),
        importado: '0',
        placa: '',
        preco: 0,
    })

    const [currentId, setCurrentId] = useState()
    const [importadoChecked, setImportadoChecked] = useState()

    function handleInputChange(event, propert) {
        //
        if (event.target.id) propert = event.target.id

        if (propert === 'importado') {
            const newSatate = !importadoChecked
            setKarango({ ...karango, importado: (newSatate ? '1' : '0') })
            setImportadoChecked(newSatate)
        } else if (propert === 'placa') {
            setKarango({ ...karango, [propert]: event.target.value.toUpperCase() })
        } else {

            setCurrentId(event.target.id)
            setKarango({ ...karango, [propert]: event.target.value })
        }
    }



    function years() {
        let result = []
        for (let i = (new Date()).getFullYear(); i >= 1900; i--) result.push(i)
        return result
    }

    async function saveData(){
        try {
            await axios.post('https://api.faustocintra.com.br/karangos/', karango)
            alert("Dados salvos com sucesso")
        }
        catch(error) {
            alert('Error: ' + error.message)
        }
    }

    function handleSubmit(event) {
        event.preventDefault() 

        saveData()
    }

    return (
        <>
            <h1>Cadastrar Novo Karango</h1>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField id="marca" label="Marca" variant="filled" value={karango.marca}
                    onChange={handleInputChange} fullWidth />

                <TextField id="modelo" label="Modelo" variant="filled" value={karango.modelo}
                    onChange={handleInputChange} fullWidth />

                <TextField id="cor" label="Cor" variant="filled" value={karango.cor}
                    onChange={event => handleInputChange(event, 'cor')} fullWidth select>
                    <MenuItem value="Amarelo">Amarelo</MenuItem>
                    <MenuItem value="Azul">Azul</MenuItem>
                    <MenuItem value="Bege">Bege</MenuItem>
                    <MenuItem value="Branco">Branco</MenuItem>
                    <MenuItem value="Cinza">Cinza</MenuItem>
                    <MenuItem value="Dourado">Dourado</MenuItem>
                    <MenuItem value="Laranja">Laranja</MenuItem>
                    <MenuItem value="Marrom">Marrom</MenuItem>
                    <MenuItem value="Prata">Prata</MenuItem>
                    <MenuItem value="Preto">Preto</MenuItem>
                    <MenuItem value="Roxo">Roxo</MenuItem>
                    <MenuItem value="Verde">Verde</MenuItem>
                    <MenuItem value="Vermelho">Vermelho</MenuItem>
                </TextField>

                <TextField id="ano_fabricacao" label="Ano de Fabricação" variant="filled"
                    value={karango.ano_fabricacao} onChange={event => handleInputChange(event, 'ano_fabricacao')}
                    fullWidth select>
                    {years().map(year => <MenuItem value={year}>{year}</MenuItem>)}
                </TextField>

                <InputMask formatChars={formatChars} mask={placaMask} id="placa"
                    onChange={event => handleInputChange(event, 'placa')} value={karango.placa}>
                    {() => <TextField label="Placa" variant="filled" fullWidth />}
                </InputMask>

                <TextField id="preco" label="Preço" variant="filled" value={karango.preco}
                    onChange={handleInputChange} fullWidth type="number" onFocus={event => event.target.select()}
                    InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment>, }} />

                <FormControl className={classes.checkbox} fullWidth>
                    <FormControlLabel
                        control={<Checkbox checked={importadoChecked} onChange={handleInputChange}
                            id="importado" />}
                        label="Importado?"
                    />
                </FormControl>

                <Toolbar className={classes.toolbar}>
                    <Button variant="contained" color="secondary" type='submit'> Enviar </Button>
                    <Button variant="contained" > Voltar </Button>
                </Toolbar>

                <div>{JSON.stringify(karango)}<br />curremtId: {currentId}</div>
            </form>
        </>
    )
}