

import TopBar from './ui/TopBar'
import FooterBar from './ui/FooterBar'
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import white from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import { Box } from '@material-ui/core'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import ClienteList from './routed/ClienteList'
import ClienteForm from './routed/ClienteForm'

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: white[50],
    },
    secondary: {
      main: blue[900],
    },
  },
});

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',  // 100% da altura da área visível
    paddingBottom: '42px' // Para que o conteúdo não fique escondido atrás do footer
  },
  routed: {
    padding: '25px',
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily
  }
}));

function Main() {
  const classes = useStyles()
  return (
    <Box className={classes.box}>
      <BrowserRouter>
        <TopBar />
        <Box id="routed" className={classes.routed}>
          <Switch>
            <Route path="/list">
              <ClienteList />
            </Route>
            <Route path="/new">
              <ClienteForm />
            </Route>
            {/* :id é um parâmetro (nomes de parâmetros começam com dois pontos) */}
            <Route path="/edit/:id">
              <ClienteForm />
            </Route>
          </Switch>
        </Box>
        <FooterBar />
      </BrowserRouter>
    </Box>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Main />  
    </ThemeProvider>
  );
}

export default App;