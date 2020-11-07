import React from "react";
import {
    deleteItemQuestion, moveItemUp,
    setCrosswordItems,
    T_CrosswordItem,
    updateItemAnswer,
    updateItemAnswerCharPosition,
    updateItemEmptiness,
    updateItemQuestion
} from "../state/CrosswordItems";
import {IconButton, TextField} from "@material-ui/core";
import {useSetRecoilState} from "recoil";
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {makeStyles} from "@material-ui/core/styles";
import {findIndex} from "ramda";

interface CrosswordItemProps {
    item: T_CrosswordItem;
    items: T_CrosswordItem[];
}

const useStyles = makeStyles((theme) => ({
    line: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: 2,
        width: '100%'
    },

    order: {
        display: 'flex'
    },
    inputs: {
        display: 'flex',
        flexGrow: 4,
        marginRight: 5,
    },
    settings: {
        display: 'flex'
    },

    question: {
        display: 'flex',
        width: '45%',
        margin: 3
    },
    answer: {
        display: 'flex',
        width: '45%',
        margin: 3
    },
    position: {
        display: 'flex',
        width: '9%',
        margin: 3
    },
}));

export const CrosswordItem: React.FC<CrosswordItemProps> = (
    {item, items}
) => {
    const classes = useStyles();

    const setItems = useSetRecoilState(setCrosswordItems);

    const updateQuestion = updateItemQuestion(item, items, setItems);
    const updateAnswer = updateItemAnswer(item, items, setItems);
    const updateAnswerCharPosition = updateItemAnswerCharPosition(item, items, setItems);
    const updateEmptiness = updateItemEmptiness(item, items, setItems)
    const moveUp = moveItemUp(item, items, setItems);

    const deleteItem = () => deleteItemQuestion(item, items, setItems);

    const getUniqueId = (name: string) => `${name}${item.id}`;

    const index = findIndex(i => i.id === item.id, items);

    return (<div className={classes.line}>
        <div className={classes.order}>
            <IconButton
                aria-label="move up"
                onClick={moveUp}
                disabled={index === 0}
            >
                <ArrowDropUpIcon />
            </IconButton>
        </div>
        <div className={classes.inputs}>
            {
                item.empty
                    ? null
                    : [
                        <TextField
                            id={getUniqueId('item-question')}
                            key={getUniqueId('item-question')}
                            className={classes.question}
                            label="Otázka"
                            onChange={updateQuestion}
                            defaultValue={item.question}
                        />,
                        <TextField
                            id={getUniqueId('item-answer')}
                            key={getUniqueId('item-answer')}
                            className={classes.answer}
                            label="Odpověď"
                            onChange={updateAnswer}
                            defaultValue={item.answer}
                        />,
                        <TextField
                            id={getUniqueId('item-answer-character-pos')}
                            key={getUniqueId('item-answer-character-pos')}
                            className={classes.position}
                            type="number"
                            label="Pozice"
                            onChange={updateAnswerCharPosition}
                            defaultValue={item.answerCharPosition + 1}
                        />
                    ]
            }
        </div>
        <div className={classes.settings}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={item.empty}
                        onChange={updateEmptiness}
                        name="empty"
                    />
                }
                label="Prázdné"
            />
            <IconButton aria-label="delete" onClick={deleteItem}>
                <DeleteIcon/>
            </IconButton>
        </div>
    </div>);
};
