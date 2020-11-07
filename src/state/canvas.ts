import {atom} from "recoil";

export const canvasAtom = atom<HTMLCanvasElement | null>({
    key: 'Canvas',
    default: null
});