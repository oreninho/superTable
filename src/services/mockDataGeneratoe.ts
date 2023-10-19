
// Function to generate mock data
import {ColumnData, CompleteTableData, RowData} from "../components/types";

const generateMockData = (columns: ColumnData, numberOfRows: number): CompleteTableData => {
    const tableData: CompleteTableData = {columns, initialData: []};
    // Helper function to generate random data based on type
    const generateDataByType = (type: string, i: number): any => {
        switch (type) {
            case 'string':
                return `Sample text ${i}`;
            case 'number':
                return Math.floor(Math.random() * 100);
            case 'boolean':
                return Math.random() > 0.5;
            default:
                return `Data ${i}`;
        }
    };

    for (let i = 0; i < numberOfRows; i++) {
        let row: Partial<RowData> = { id: `row_${i}` }; // ensure unique id for each row
        columns.forEach(column => {
            row[column.id] = generateDataByType(column.type, i);
        });
        if (tableData.initialData) {
            tableData.initialData.push(row as RowData);
        }
    }

    return tableData;
};

// Usage of the function

export default generateMockData



// Now `mockData` is ready to be used as the data source for your table.
