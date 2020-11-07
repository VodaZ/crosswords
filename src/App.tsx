import React from 'react';
import './App.css';
import {makeStyles} from "@material-ui/core/styles";
import {Grid, Paper} from "@material-ui/core";
import {CrosswordItems} from "./components/CrosswordItems";
import {RecoilRoot} from "recoil";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

function App() {
    const classes = useStyles();


    return (
        <RecoilRoot>
            <div className="App">
                <div className={classes.root}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Paper className={classes.paper}>
                                <CrosswordItems/>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper className={classes.paper}>Obrázek křížovky</Paper>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </RecoilRoot>
    );
}

export default App;
