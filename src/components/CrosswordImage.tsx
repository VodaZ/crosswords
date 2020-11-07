import React, {useEffect, useRef} from "react";
import {T_CrosswordItem} from "../state/CrosswordItems";
import {last} from "ramda";
import {useSetRecoilState} from "recoil";
import {canvasAtom} from "../state/canvas";

interface CrosswordImageProps {
    items: T_CrosswordItem[];
}

const cellSide = 50;
const textLineHeight = 35;
const spaceAfterCrossword = 60;
const globalXOffset = 20;
const globalYOffset = 20;
const textSettings = "30px Arial";

const rect = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    lineWidth = 2
) => {
    context.lineWidth = lineWidth;
    context.beginPath();
    context.rect(x, y, w, h);
    context.stroke();
}

const fillRect = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
) => {
    context.lineWidth = 2;
    context.beginPath();
    context.rect(x, y, w, h);
    context.stroke();
    context.fillRect(x, y, w, h);
};

const cutTextToChunks = (
    context: CanvasRenderingContext2D,
    text: string | undefined,
    width: number
) => (text || '').split(' ').reduce((acc, val) => {
    const l = last(acc);

    const possibleText = (l === '') ? val : (l + ' ' + val);
    const posTextLength = context.measureText(possibleText).width;

    if (posTextLength > width) {
        return [...acc, val];
    } else {
        acc[acc.length - 1] = possibleText;
        return acc;
    }
}, ['']);

const text = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    str: string | undefined,
    maxWidth = 10000
) => {
    const chunks = cutTextToChunks(context, str, maxWidth);

    context.font = textSettings;
    chunks.forEach((chunk, index) => context.fillText(chunk, x, y + textLineHeight * index));

    return chunks.length * textLineHeight;
};

interface Line {
    question?: string;
    answer?: string;
    fieldIndex?: number;
    length: number;
    toRightFromField: number;
    toLeftFromField: number;
    empty?: boolean;
    number: number;
}

const line = (
    question: string,
    answer: string,
    fieldIndex: number
): Line => ({
    question,
    answer,
    fieldIndex,
    length: answer.length,
    toRightFromField: fieldIndex,
    toLeftFromField: answer.length - fieldIndex - 1,
    number: -1
});

const emptyLine = (): Line => ({
    empty: true,
    length: 0,
    toRightFromField: 0,
    toLeftFromField: 0,
    number: -1
});

const sortLinesByProp = (prop: keyof Line) => (lines: Line[]) => [...lines].sort((l1, l2) => {
    const p1 = l1[prop] as number;
    const p2 = l2[prop] as number;

    return p2 - p1;
});

const sortLinesByRightFromField = sortLinesByProp('toRightFromField');
const sortLinesByLeftFromField = sortLinesByProp('toLeftFromField');

const maxByRightFromField = (lines: Line[]) => sortLinesByRightFromField(lines)[0];
const maxByLeftFromField = (lines: Line[]) => sortLinesByLeftFromField(lines)[0];

const displayCrosswordLine = (
    context: CanvasRenderingContext2D,
    xOffset: number,
    yOffset: number,
    {crosswordWidth, maxRight, maxLeft}: {crosswordWidth: number, maxRight: number, maxLeft: number}
) => (
    line: Line,
    index: number
) => {
    if (line.empty) {
        const x = (maxRight + 1) * cellSide + xOffset;
        const y = (index * cellSide) + yOffset;

        fillRect(context, x, y, cellSide, cellSide);
        rect(context, x, y, cellSide, cellSide, 4);

        return;
    }

    const lineStart = maxRight - line.toRightFromField + 1;

    text(context, xOffset, (index + 0.75) * cellSide + yOffset, `${line.number}.`);

    for (let i = 0; i < line.length; i++) {
        const x = (lineStart + i) * cellSide + xOffset;
        const y = index * cellSide + yOffset;

        const border = i === line.fieldIndex ? 4 : 2;

        rect(context, x, y, cellSide, cellSide, border);
    }
};

const displayQuestionLine = (
    context: CanvasRenderingContext2D,
    line: Line,
    x: number,
    y: number,
    maxTextWidth: number
) => {
    if(line.empty) {
        return 0;
    }

    text(context, x, y, `${line.number}.`);
    const b = text(context, x + cellSide, y, line.question, maxTextWidth);

    return b;
};

const addNumbersToLines = (lines: Line[]) => {
    let number = 1;

    return lines.map(line => {
        if(line.empty) {
            return line;
        }

        line.number = number++;
        return line;
    });
};

const displayLines = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    lines: Line[]
) => {
    lines = addNumbersToLines(lines);

    if(lines.length === 0) {
        return;
    }

    const maxRight = maxByRightFromField(lines).toRightFromField;
    const maxLeft = maxByLeftFromField(lines).toLeftFromField;
    const crosswordWidth = maxRight + 1 + maxLeft;
    const maxTextWidth = crosswordWidth * cellSide;

    const drawText = () => lines.reduce(
        (y, line) => y + displayQuestionLine(context, line, globalXOffset, y, maxTextWidth),
        globalYOffset + lines.length * cellSide + spaceAfterCrossword
    );

    canvas.width = 2*globalXOffset + cellSide*(crosswordWidth+1);
    canvas.height = drawText();

    lines.map(displayCrosswordLine(context, globalXOffset, globalYOffset, {crosswordWidth, maxRight, maxLeft}));
    drawText();
};


export const CrosswordImage: React.FC<CrosswordImageProps> = ({items}) => {
    const canvasRef = useRef(null);

    const setCanvas = useSetRecoilState(canvasAtom);

    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) {
            return;
        }

        // @ts-ignore
        const context = canvas.getContext('2d')

        const lines = items.map(item => item.empty
            ? emptyLine()
            : line(item.question, item.answer, item.answerCharPosition)
        );

        displayLines(
            canvas,
            context,
            lines
        );

        setCanvas(canvas);
    }, [items, setCanvas]);

    return <canvas ref={canvasRef}/>
};