import React from "react";
import {
    crosswordItemsAtom,
    T_CrosswordItem,
    updateItemAnswer,
    updateItemAnswerCharPosition,
    updateItemQuestion
} from "../state/CrosswordItems";
import {TextField} from "@material-ui/core";
import {useRecoilState} from "recoil";

interface CrosswordItemProps {
    item: T_CrosswordItem;
}

export const CrosswordItem: React.FC<CrosswordItemProps> = (
    {item}
) => {
    const [items, setItems] = useRecoilState(crosswordItemsAtom);

    const updateQuestion = updateItemQuestion(item, items, setItems);
    const updateAnswer = updateItemAnswer(item, items, setItems);
    const updateAnswerCharPosition = updateItemAnswerCharPosition(item, items, setItems);

    return (<div>
        <TextField
            id="item-question"
            label="Otázka"
            onChange={updateQuestion}
        />
        <TextField
            id="item-answer"
            label="Standard"
            onChange={updateAnswer}
        />
        <TextField
            id="item-answer-character-pos"
            type="number"
            label="Pozice"
            onChange={updateAnswerCharPosition}
        />
    </div>);
};
