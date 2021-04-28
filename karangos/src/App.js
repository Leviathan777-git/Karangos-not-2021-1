import './App.css';
import TopBar from './ui/TopBar'

/*
    <div className="App">
      <header className="App-header">
        <h1>Projeto Carangos</h1>
        <Button variant="contained" color="primary">Click aqui</Button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div> */

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';
import pink from '@material-ui/core/colors/pink';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: yellow[500],
    },
    secondary: {
      main: pink[500],
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <TopBar />
    </ThemeProvider>
  );
}

export default App;
