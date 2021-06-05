import { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import InputMask from 'react-input-mask'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory, useParams } from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'

const useStyles = makeStyles(() => ({
  form: {
    maxWidth: '80%',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    '& .MuiFormControl-root': {
      minWidth: '200px',
      maxWidth: '500px',
      marginBottom: '24px',
    }
  },
  toolbar: {
    marginTop: '36px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around'
  },
}))

/* Classes de caracteres de entrada para a máscara do campo placa 
  1) Três primeiras posições: qualquer letra, de A a Z (maiúsculo ou minúsculo) ~> [A-Za-z]
  2) Posições numéricas (1ª, a 3ª e a 4ª depois do traço) ~> [0-9]
  3) 2º posição após o traço: pode receber dígitos ou letras de A a J (maiúsculas ou minúsculas) ~> [0-9A-Ja-j]
*/

// Representando as classes de caracteres da máscara como um objeto
const formatChars = {
  'A': '[A-Za-z]',
  '0': '[0-9]',
  '#': '[0-9A-Ja-j]'
}

// Finalmente, a máscara de entrada do campo cpf rg e telefoene
const cpfMask = '000.000.000-00'
const rgMask = '00.000.000-0'
const telefoneMask = '(00) 00000-0000'


export default function ClienteForm() {
  const classes = useStyles()

  const [cliente, setCliente] = useState({
    id: null,
    nome: '',
    cpf: '',
    rg: '',
    logradouro: '',
    num_imovel: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    telefone: '',
    email: ''
  })

  const [snackState, setSnackState] = useState({
    open: false,
    severity: 'success',
    message: 'Cliente salvo com sucesso'
  })

  const [btnSendState, setBtnSendState] = useState({
    disabled: false,
    label: 'Enviar'
  })

  const [error, setError] = useState({
    nome: '',
    cpf: '',
    rg: '',
    logradouro: '',
    num_imovel: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    telefone: '',
    email: '',
  })


  const [isModified, setIsModified] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)

  const [title, setTitle] = useState('Cadastrar Novo Cliente')

  const history = useHistory()

  const params = useParams()

  useEffect(() => {
    // Verifica se tem o parâmetro id na rota. Se tiver, temos que buscar
    // os dados do registro no back-end para edição
    if (params.id) {
      setTitle('Editando Cliente')
      getData(params.id)
    }
  }, [])

  async function getData(id) {
    try {
      let response = await axios.get(`https://api.faustocintra.com.br/clientes/${id}`)
      setCliente(response.data)
    }
    catch (error) {
      setSnackState({
        open: true,
        severity: 'error',
        message: 'Não foi possível carregar os dados para edição.'
      })
    }
  }


  function handleInputChange(event, property) {
    const clienteTemp = { ...cliente }

    if (event.target.id) property = event.target.id

    if (property === 'cpf') {
      clienteTemp[property] = event.target.value
    } else if (property === 'rg') {
      clienteTemp[property] = event.target.value
    } else if (property === 'telefone') {
      clienteTemp[property] = event.target.value
    } else {
      // Quando o nome de uma propriedade de um objeto aparece entre [],
      // isso se chama "propriedade calculada". O nome da propriedade vai
      // corresponder à avaliação da expressão entre os colchetes
      clienteTemp[property] = event.target.value
    }

    setCliente(clienteTemp)
    setIsModified(true)   // O formulário foi modificado
    validate(clienteTemp)
  }

  function validate(data) {

    const errorTemp = {
      nome: '',
      cpf: '',
      rg: '',
      logradouro: '',
      num_imovel: '',
      complemento: '',
      bairro: '',
      municipio: '',
      uf: '',
      telefone: '',
      email: '',
    }

    let isValid = true

    // Validação do campo nome
    if (data.nome.trim() === '') { // trim(): retira espaços em branco do início e do final de uma string
      errorTemp.nome = 'O nome deve ser preenchida'
      isValid = false
    }

    // Validação do campo cpf
    if (data.cpf.trim() === '' || data.cpf.includes('_')) {
      errorTemp.cpf = 'O CPF deve ser preenchido'
      isValid = false
    }

    // Validação do campo rg
    if (data.rg.trim() === '' || data.rg.includes('_')) {
      errorTemp.rg = 'O RG deve ser preenchido'
      isValid = false
    }

    // Validação do campo logadura
    if (data.logradouro.trim() === '') {
      errorTemp.logradouro = 'A logradura deve ser prenchida'
      isValid = false
    }

    // Validação do numero do imovel
    if (data.num_imovel.trim() === '') {
      errorTemp.num_imovel = 'O Numero do imovel deve ser prenchido'
      isValid = false
    }
    // Validação do bairro
    if (data.bairro.trim() === '') {
      errorTemp.bairro = 'o Bairro deve ser prenchida'
      isValid = false
    }
    // Validação do municipio
    if (data.municipio.trim() === '') {
      errorTemp.municipio = 'o Municipio deve ser prenchida'
      isValid = false
    }
    // Validação do estado
    if (data.uf.trim() === '') {
      errorTemp.uf = 'Escolha um Estado'
      isValid = false
    }
    // Validação do numero do telefone
    if (data.telefone.trim() === '' || data.telefone.includes('_')) {
      errorTemp.telefone = 'O Telefone deve ser prenchido'
      isValid = false
    }
    // Validação do email
    if (data.email.trim() === '') {
      errorTemp.email = 'O Email deve ser prenchida'
      isValid = false
    }

    setError(errorTemp)
    return isValid
  }

  async function saveData() {

    try {
      // Desabilitar o botão Enviar
      setBtnSendState({ disabled: true, label: 'Enviando...' })

      // Se o registro já existe (edição, verbo HTTP PUT)
      if (params.id) await axios.put(`https://api.faustocintra.com.br/clientes/${params.id}`, cliente)
      // Registro não existe, cria um novo (verbo HTTP POST)
      else await axios.post('https://api.faustocintra.com.br/clientes', cliente)

      setSnackState({
        open: true,
        severity: 'success',
        message: 'Cliente salvo com sucesso!'
      })
    }
    catch (error) {
      setSnackState({
        open: true,
        severity: 'error',
        message: 'ERRO: ' + error.message
      })
    }
    // Reabilitar o botão Enviar
    setBtnSendState({ disabled: false, label: 'Enviar' })
  }

  function handleSubmit(event) {

    event.preventDefault() // Evita o recarregamento da página
   
    if (validate(cliente)) saveData() // Só salva os dados se eles forem válidos
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  function handleSnackClose(event, reason) {
    // Evita que a snackbar seja fechada clicando-se fora dela
    if (reason === 'clickaway') return
    setSnackState({ ...snackState, open: false }) // Fecha a snackbar

    history.push('/list')   // Retorna à página de listagem
  }

  function handleDialogClose(result) {
    setDialogOpen(false)

    if (result) history.push('/list')// Se o usuário concordou em voltar
  }

  function handleGoBack() {
    if (isModified) setDialogOpen(true) // Se o formulário estiver modificado, mostramos o diálogo de confirmação
    
    else history.push('/list')// Senão, voltamos diretamente à página de listagem
  }

  return (
    <>
      <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
        Há dados não salvos. Deseja realmente voltar?
      </ConfirmDialog>

      <Snackbar open={snackState.open} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={snackState.severity}>
          {snackState.message}
        </Alert>
      </Snackbar>

      <h1>{title}</h1>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          id="nome"
          label="Nome"
          variant="filled"
          value={cliente.nome}
          onChange={handleInputChange}
          fullWidth
          required
          error={error.nome !== ''}
          helperText={error.nome} />

        <InputMask
          formatChars={formatChars}
          mask={cpfMask}
          id="cpf"
          onChange={event => handleInputChange(event, 'cpf')}
          value={cliente.cpf}
        >
          {() => <TextField
            label="CPF"
            variant="filled"
            fullWidth
            required
            error={error.cpf !== ''}
            helperText={error.cpf}
          />}
        </InputMask>

        <InputMask
          formatChars={formatChars}
          mask={rgMask}
          fullWidth
          id="rg"
          onChange={event => handleInputChange(event, 'rg')}
          value={cliente.rg}
        >
          {() => <TextField
            label="RG"
            variant="filled"
            fullWidth
            required
            error={error.rg !== ''}
            helperText={error.rg}
          />}
        </InputMask>

        <TextField
          id="logradouro"
          label="Logradouro"
          variant="filled"
          value={cliente.logradouro}
          onChange={handleInputChange}
          fullWidth
          required
          error={error.logradouro !== ''}
          helperText={error.logradouro}
        />

        <TextField
          id="num_imovel"
          label="Número imovel"
          variant="filled"
          value={cliente.num_imovel}
          onChange={handleInputChange}
          fullWidth
          required
          error={error.num_imovel !== ''}
          helperText={error.num_imovel}
        />

        <TextField
          id="complemento"
          label="Complemento"
          variant="filled"
          value={cliente.complemento}
          onChange={handleInputChange}
          fullWidth
        />

        <TextField
          id="bairro"
          label="Bairro"
          variant="filled"
          value={cliente.bairro}
          onChange={handleInputChange}
          fullWidth
          required
          error={error.bairro !== ''}
          helperText={error.bairro}
        />

        <TextField
          id="municipio"
          label="Municipio"
          variant="filled"
          value={cliente.municipio}
          onChange={handleInputChange}
          fullWidth
          required
          error={error.municipio !== ''}
          helperText={error.miicipio}
        />

        <TextField
          id="uf"
          label="Estado"
          variant="filled"
          value={cliente.uf}
          onChange={event => handleInputChange(event, 'uf')}
          select
          fullWidth
          required
          error={error.uf !== ''}
          helperText={error.uf}
        >
          <MenuItem value="AC">Acre</MenuItem>
          <MenuItem value="AL">Alagoas</MenuItem>
          <MenuItem value="AP">Amapá</MenuItem>
          <MenuItem value="AM">Amazonas</MenuItem>
          <MenuItem value="BA">Bahia</MenuItem>
          <MenuItem value="CE">Ceará</MenuItem>
          <MenuItem value="DF">Distrito Federal</MenuItem>
          <MenuItem value="ES">Espírito Santo</MenuItem>
          <MenuItem value="GO">Goiás</MenuItem>
          <MenuItem value="MA">Maranhão</MenuItem>
          <MenuItem value="MT">Mato Grosso</MenuItem>
          <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
          <MenuItem value="MG"> Minas Gerais</MenuItem>
          <MenuItem value="PA">Pará</MenuItem>
          <MenuItem value="PB">Paraíba</MenuItem>
          <MenuItem value="PR">Paraná</MenuItem>
          <MenuItem value="PE">Pernambuco</MenuItem>
          <MenuItem value="PI">Piauí</MenuItem>
          <MenuItem value="RJ">Rio de Janeiro</MenuItem>
          <MenuItem value="RN">Rio Grande do Norte</MenuItem>
          <MenuItem value="RS">Rio Grande do Sul</MenuItem>
          <MenuItem value="RO">Rondônia</MenuItem>
          <MenuItem value="RR">Roraima</MenuItem>
          <MenuItem value="SC">Santa Catarina</MenuItem>
          <MenuItem value="SP">São Paulo</MenuItem>
          <MenuItem value="SE">Sergipe</MenuItem>
          <MenuItem value="TO">Tocantins</MenuItem>
        </TextField>

        <InputMask
          formatChars={formatChars}
          mask={telefoneMask}
          fullWidth
          id="telefone"
          onChange={event => handleInputChange(event, 'telefone')}
          value={cliente.telefone}
        >
          {() => <TextField
            formatChars={formatChars}
            mask={telefoneMask}
            label="Telefone"
            variant="filled"
            fullWidth
            required
            error={error.telefone !== ''}
            helperText={error.telefone}
          />}
        </InputMask>

        <TextField
          id="email"
          label="Email"
          variant="filled"
          value={cliente.email}
          onChange={handleInputChange}
          fullWidth
          required
          error={error.email !== ''}
          helperText={error.email}
        />

        <Toolbar className={classes.toolbar}>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={btnSendState.disabled}
          >
            {btnSendState.label}
          </Button>
          <Button variant="contained" onClick={handleGoBack}>
            Voltar
          </Button>
        </Toolbar>

        {/* <div>{JSON.stringify(cliente)}<br />currentId: {currentId}</div> */}
      </form>
    </>
  )
}