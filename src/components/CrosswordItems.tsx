import React from "react";
import {useRecoilState} from "recoil";
import {addCrosswordItem, crosswordItemsAtom} from "../state/CrosswordItems";
import {CrosswordItem} from "./CrosswordItem";
import {Button} from "@material-ui/core";

export const CrosswordItems: React.FC = () => {
    const [items, setItems] = useRecoilState(crosswordItemsAtom);

    const addEmptyItem = addCrosswordItem(items, setItems);

    return (<div>
        {
            items.map(item => <CrosswordItem item={item} key={item.id}/>)
        }

        <Button
            variant="contained"
            onClick={addEmptyItem}
        >
            Přidat
        </Button>
    </div>);
};
