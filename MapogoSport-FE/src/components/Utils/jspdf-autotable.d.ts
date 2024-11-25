declare module 'jspdf-autotable' {
    import jsPDF from 'jspdf';

    type TableRow = TableCell[];
    type TableCell = string | number | boolean | null;

    export default function autoTable(
        doc: jsPDF,
        options: {
            startY?: number;
            head?: string[][];
            body?: TableRow[];
            theme?: 'striped' | 'grid' | 'plain' | 'hide';
            styles?: {
                fillColor?: string | string[];
                textColor?: string | string[];
                halign?: 'center' | 'left' | 'right';
                valign?: 'middle' | 'top' | 'bottom';
                fontSize?: number;
                fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic';
                font: string;
                cellPadding: number;
            };
            columnStyles?: {
                [key: number]: {
                    cellWidth?: number | 'auto';
                    fillColor?: string;
                    textColor?: string;
                    halign: 'center' | 'left' | 'right';
                };
            };
            didParseCell?: (data: {
                column: number;
                row: number;
                cell: {
                    raw: TableCell;
                    text: string[];
                };
            }) => void;
            didDrawCell?: (data: {
                column: number;
                row: number;
                cell: {
                    raw: TableCell;
                    text: string[];
                    x: number;
                    y: number;
                };
            }) => void;
        }
    ): void
}
