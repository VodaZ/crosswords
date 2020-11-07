import {useRecoilValue} from "recoil";
import {crosswordItems} from "../state/CrosswordItems";
import {Grid, Paper} from "@material-ui/core";
import {CrosswordItems} from "./CrosswordItems";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {CrosswordImage} from "./CrosswordImage";
import {CrosswordSaving} from "./CrosswordSaving";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export const Crossword: React.FC = () => {
    const classes = useStyles();

    const items = useRecoilValue(crosswordItems);

    return (<Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
            <Paper className={classes.paper}>
                <CrosswordItems items={items}/>
            </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
            <Paper className={classes.paper}>
                <CrosswordImage items={items}/>
            </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
            <Paper className={classes.paper}>
                <CrosswordSaving items={items} />
            </Paper>
        </Grid>
    </Grid>);
};
