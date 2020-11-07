import React from "react";
import {useSetRecoilState} from "recoil";
import {addCrosswordItem, setCrosswordItems, T_CrosswordItem} from "../state/CrosswordItems";
import {CrosswordItem} from "./CrosswordItem";
import {Button} from "@material-ui/core";

interface CrosswordItemsProps {
    items: T_CrosswordItem[]
}

export const CrosswordItems: React.FC<CrosswordItemsProps> = ({items}) => {
    const setItems = useSetRecoilState(setCrosswordItems);

    const addEmptyItem = addCrosswordItem(items, setItems);

    return (<div>
        {
            items.map(item => <CrosswordItem items={items} item={item} key={item.id}/>)
        }

        <Button
            variant="contained"
            onClick={addEmptyItem}
        >
            Přidat
        </Button>
    </div>);
};
