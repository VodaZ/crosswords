import {atom, selector, SetterOrUpdater} from "recoil";
import {v4 as uuid} from 'uuid';
import {ChangeEvent} from "react";
import {findIndex, insert, update, without} from "ramda";

export interface T_CrosswordItem {
    id: string;
    question: string;
    answer: string;
    answerCharPosition: number;
    empty: boolean;
}

const crosswordItemsKey = 'CrosswordItems';

const loadCrosswordItemsFromLocalStorage = (): T_CrosswordItem[] => {
    const items = localStorage.getItem(crosswordItemsKey);
    if (!items) {
        return [];
    }

    try {
        return JSON.parse(items);
    } catch (e) {
        console.error(e);

        return [];
    }
};

const saveCrosswordItemsToLocalStorage = (items: T_CrosswordItem[]) => {
    const json = JSON.stringify(items);

    localStorage.setItem('CrosswordItems', json);
};

export const crosswordItems = atom<T_CrosswordItem[]>({
    key: crosswordItemsKey,
    default: loadCrosswordItemsFromLocalStorage()
});

export const setCrosswordItems = selector<T_CrosswordItem[]>({
    key: 'SetCrosswordItems',
    get: ({get}) => get(crosswordItems),
    set: ({get, set}, newValue) => {
        set(crosswordItems, newValue);
        saveCrosswordItemsToLocalStorage(newValue as T_CrosswordItem[]);
    }
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
            answerCharPosition: 0,
            empty: false
        }
    ]);
};

const updateItemWithId = (
    updater: (value: string, item: T_CrosswordItem) => T_CrosswordItem
) => (
    item: T_CrosswordItem,
    items: T_CrosswordItem[],
    setItems: SetterOrUpdater<T_CrosswordItem[]>
) => (
    event: ChangeEvent<HTMLInputElement>
) => {
    const itemPos = items.findIndex(i => i.id === item.id);
    if (itemPos === -1) {
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
        answerCharPosition: parseInt(answerCharPosition, 10) - 1
    })
);

export const updateItemEmptiness = updateItemWithId(
    (_, item) => ({
        ...item,
        empty: !item.empty
    })
);

export const moveItemUp = (
    item: T_CrosswordItem,
    items: T_CrosswordItem[],
    setItems: SetterOrUpdater<T_CrosswordItem[]>
) => () => {
    const currentPosition = findIndex(i => i.id === item.id, items);
    if(currentPosition <= 0) {
        return;
    }

    const withoutCurrent = without([item], items);
    const newItems = insert(currentPosition-1, item, withoutCurrent);

    setItems(newItems);
};

export const deleteItemQuestion = (
    item: T_CrosswordItem,
    items: T_CrosswordItem[],
    setItems: SetterOrUpdater<T_CrosswordItem[]>
) => {
    const newItems = without([item], items);

    setItems(newItems);
};
