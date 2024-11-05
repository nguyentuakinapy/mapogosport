declare module 'jspdf-autotable' {
    import jsPDF from 'jspdf';

    export interface AutoTableOptions {
        startY?: number;
        head?: string[][];
        body?: any[][];
        theme?: 'striped' | 'grid' | 'plain' | 'hide';
        styles?: {
            fillColor?: string | string[];
            textColor?: string | string[];
            halign?: 'center' | 'left' | 'right';
            valign?: 'middle' | 'top' | 'bottom';
            fontSize?: number;
            fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic';
        };
        columnStyles?: {
            [key: number]: {
                cellWidth?: number | 'auto';
                fillColor?: string;
                textColor?: string;
            };
        };
        didParseCell?: (data: any) => void;
        didDrawCell?: (data: any) => void;
    }

    export function autoTable(doc: jsPDF, options: AutoTableOptions): void;
}