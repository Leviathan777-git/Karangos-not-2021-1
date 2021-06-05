import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LocalCafeTwoToneIcon from '@material-ui/icons/LocalCafeTwoTone';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
    text: { 
        width: '100%',
        color: theme.palette.text.secondary
    },
    toolbar: {
        backgroundColor: theme.palette.background.paper,
        minHeight: '42px',
        //posicionando a barra no rodapé da pagina
        width: '100%',
        position: 'fixed',
        bottom: 0, 
    },
    link: {
        color: theme.palette.secondary.light,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline'
        },
    }
}));

export default function FooterBar() {
    const classes = useStyles();

    return (
        <Toolbar className={classes.toolbar}>
            <Typography variant="caption" align="center" className={classes.text}>
                Desenvolvido com <LocalCafeTwoToneIcon fontSize='small' /> por <a href="gabriel.souza89@fatec.sp.gov.br	" className={classes.link}> Gabriel Desenvolvedor</a>
            </Typography>
        </Toolbar>
    )

}