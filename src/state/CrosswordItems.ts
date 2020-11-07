import {atom, SetterOrUpdater} from "recoil";
import { v4 as uuid } from 'uuid';
import {ChangeEvent} from "react";
import {update} from "ramda";

export interface T_CrosswordItem {
    id: string;
    question: string;
    answer: string;
    answerCharPosition: number;
}

export const crosswordItemsAtom = atom<T_CrosswordItem[]>({
    key: 'CrosswordItem',
    default: []
});

export const addCrosswordItem = (
    items: T_CrosswordItem[],
    setItems: SetterOrUpdater<T_CrosswordItem[]>
) => () => {
    setItems([
        ...items,
        {
            id: uuid(),
            question: '',
            answer: '',
            answerCharPosition: 0
        }
    ]);
};

const updateItemWithId =  (
    updater: (value: string, item: T_CrosswordItem) => T_CrosswordItem
) => (
    item: T_CrosswordItem,
    items: T_CrosswordItem[],
    setItems: SetterOrUpdater<T_CrosswordItem[]>
) => (
    event: ChangeEvent<HTMLInputElement>
) => {
    const itemPos = items.findIndex(i => i.id === item.id);
    if(itemPos === -1) {
        return;
    }

    const value = event.target.value;
    const newItem = updater(value, item);
    const newItems = update(itemPos, newItem, items);

    setItems(newItems);
 };

export const updateItemQuestion = updateItemWithId(
    (question, item) => ({
        ...item,
        question
    })
);

export const updateItemAnswer = updateItemWithId(
    (answer, item) => ({
        ...item,
        answer
    })
);

export const updateItemAnswerCharPosition = updateItemWithId(
    (answerCharPosition, item) => ({
        ...item,
        answerCharPosition: parseInt(answerCharPosition, 10)
    })
);

