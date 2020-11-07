import React from 'react';
import './App.css';
import {makeStyles} from "@material-ui/core/styles";
import {RecoilRoot} from "recoil";
import {Crossword} from "./components/Crossword";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

function App() {
    const classes = useStyles();

    return (
        <RecoilRoot>
            <div className="App">
                <div className={classes.root}>
                    <Crossword />
                </div>
            </div>
        </RecoilRoot>
    );
}

export default App;
