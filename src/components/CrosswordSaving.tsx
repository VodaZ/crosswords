import React, {ChangeEvent, useRef} from "react";
import {setCrosswordItems, T_CrosswordItem} from "../state/CrosswordItems";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {Button} from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {canvasAtom} from "../state/canvas";

interface CrosswordSavingProps {
    items: T_CrosswordItem[]
}

const createJsonFile = (items: T_CrosswordItem[]) => {
    const element = document.createElement("a");
    const file = new Blob([
        JSON.stringify(items),
    ], {type: 'text/plain'});

    element.href = URL.createObjectURL(file);
    element.download = "krizovka.json";

    document.body.appendChild(element);
    element.click();
};

const downloadCanvas = (canvas: HTMLCanvasElement | null) => {
    if(!canvas) {
        return;
    }

    const element = document.createElement("a");

    element.href = canvas.toDataURL("image/png");
    element.download = "krizovka.png";

    document.body.appendChild(element);
    element.click();
};

export const CrosswordSaving: React.FC<CrosswordSavingProps> = ({items}) => {
    const setItems = useSetRecoilState(setCrosswordItems);
    const canvas = useRecoilValue(canvasAtom);

    const download = () => createJsonFile(items);

    const uploadRef = useRef<HTMLInputElement>(null);

    const startUpload = () => {
        if (!uploadRef) {
            return;
        }

        // @ts-ignore
        uploadRef.current.click();
    };

    const reader = new FileReader();
    reader.onload = async (e) => {
        if(!e.target) {
            return;
        }

        const text = e.target.result;
        if(!text) {
            console.error('Text of file is undefined');
            return;
        }

        try {
            const parsed = JSON.parse(text.toString());
            setItems(parsed);
        }
        catch (e) {
            console.error(e);
        }
    };

    const fileUploaded = (event: ChangeEvent<HTMLInputElement>) => {
        if(!event.target || !event.target.files || !event.target.files[0]) {
            return;
        }

        reader.readAsText(event.target.files[0]);
    };

    const downloadImage = () => downloadCanvas(canvas);

    return <div>
        <input type="file" id="file" ref={uploadRef} style={{display: "none"}} onChange={fileUploaded}/>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button onClick={downloadImage} disabled={!canvas}>Stáhnout obrázek</Button>
            <Button onClick={download}>Stáhnout zálohu</Button>
            <Button onClick={startUpload}>Nahrát zálohu</Button>
        </ButtonGroup>
    </div>
};