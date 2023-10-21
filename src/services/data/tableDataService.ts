
/*
all the related db code is not used in this project
 */
import {ColumnsData, CompleteTableData, RowData} from "../../components/types";
import {dataService} from "./dataService";
import generateMockData from "../mockDataGeneratoe";



class TableDataService {
    private db = dataService;
    private static TABLE_KEY = 'tableData';
    constructor() {
        if (!localStorage.getItem(TableDataService.TABLE_KEY)) {
            localStorage.setItem(TableDataService.TABLE_KEY, JSON.stringify([]));
        }
    }

    private addIdToData(data: any[]): RowData[] {
        return data.map((row, index) => {
            return {...row, id: String(index)} ;
        }) as unknown as RowData[];
    }

    async getData<T>(): Promise<T> {
        try {
            // Try to get data from the storage
            let possibleData = await this.db.get(TableDataService.TABLE_KEY);
            // If data exists in the storage, parse and return it
            if (possibleData && possibleData!.length > 8) {
                let data = JSON.parse(possibleData!.toString());
                data.initialData = this.addIdToData(data.initialData); //fixing the id, should be
                console.log('getData', data);
                return data as T;
            }

            // If no data was found in the storage, use the mocked data
            console.log('No data found, setting default data.');
            const mockedData = await import( '../../data/mocked-data.json');
            mockedData.default.initialData.map((row, index) => {
                if (!row.hasOwnProperty( 'id') ) {
                    Object.defineProperty(row, 'id', {value: String(index), writable: true, enumerable: true, configurable: true})
                }
            })
            //not sure if I should add the data to the storage on this function
            //await this.db.set(TableDataService.TABLE_KEY, JSON.stringify(mockedData.default), 60*60*24);
            return mockedData as T;

        } catch (error) {
            console.error('Error in getData:', error);

            // In case of any error, return an empty array of type T
            return [] as T;
        }
    }

    //should move to a service - fileService
    async loadFile<T>(file:File): Promise<T> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const content = event.target?.result as string;
                    const data = JSON.parse(content) as T
                    resolve(data);
                } catch (error) {
                    reject(`Error parsing file: ${error}`);
                }
            };
            reader.readAsText(file);
        });
    }

    async getMockData<T>(): Promise<T> {
        const columns: ColumnsData = [
            { id: 'name', ordinalNo: 1, title: 'Name', type: 'string', width: 200 },
            { id: 'age', ordinalNo: 2, title: 'Age', type: 'number', width: 100 },
            { id: 'isVerified', ordinalNo: 3, title: 'Verified', type: 'boolean', width: 150 },
            { id: 'address', ordinalNo: 4, title: 'Address', type: 'string', width: 300 },
        ];

        const numberOfRows = 2000; // or any large number for stress testing
        return generateMockData(columns, numberOfRows) as T;
    }

    async updateData(data:RowData,allData:CompleteTableData): Promise<boolean> {
        const {initialData,columns} = allData;
        const flatData  = this.flattenGroupedData(initialData); //they both needs to speak the same language
        const flatRows = this.flattenGroupedData([data]);
        if (flatData) {
            for (let i = 0; i < flatData.length; i++) {
                let flatRow = flatRows.filter((row)=>{
                    return row.id === flatData[i].id;
                });
                if (flatRow.length > 0) {
                    flatData[i] = flatRow[0];
                }
            }
        }

        await this.db.set(TableDataService.TABLE_KEY, JSON.stringify({initialData:flatData,columns}), 60*60*24);
        return true;
    }
    async setData(data:CompleteTableData): Promise<boolean> {
        const savedData = data;
       // savedData.initialData = this.flattenGroupedData(savedData.initialData); //todo - assuming we dont want to save grouped data
        console.log("flattened data",savedData);
        this.db.set(TableDataService.TABLE_KEY, JSON.stringify(savedData), 60*60*24);
        return true;
    }

    //todo - is this the correct place for this function?
    groupBy(array: RowData[], key: string): RowData[] {
        const group = array.reduce((result, currentValue,currentIndex) => {
            const keyValue = String(currentValue[key]);

            if (!result[keyValue]) {
                result[keyValue] = {...currentValue, children: []};
            }
            else{
                result[keyValue].children!.push(currentValue);
            }

            return result;
        }, {} as Record<string, RowData>);

        // Return an array of the group objects
        return Object.values(group);
    }

    //todo - should I make it async?
    private flattenGroupedData(groupedData: RowData[]): RowData[] {
        return groupedData.reduce((result, currentValue) => {
            // Push the current item without the children field
            const { children, ...rest } = currentValue;
            result.push(rest);

            // If there are children, recursively flatten them and append
            if (children) {
                result.push(...this.flattenGroupedData(children));
            }

            return result;
        }, [] as RowData[]);
    }

}
const tableDataService = new TableDataService();
export default tableDataService;