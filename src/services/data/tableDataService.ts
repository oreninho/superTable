
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

    private addIdToData(data: RowData[]): RowData[] {
        return data.map((row, index) => {
            return {...row, id: String(index)};
        });
    }

    async getData<T>(): Promise<T> {
        try {
            //exmple of mocked data generation
            // const columns: ColumnsData = [
            //     { id: 'name', ordinalNo: 1, title: 'Name', type: 'string', width: 200 },
            //     { id: 'age', ordinalNo: 2, title: 'Age', type: 'number', width: 100 },
            //     { id: 'isVerified', ordinalNo: 3, title: 'Verified', type: 'boolean', width: 150 }
            //
            //     // ... other columns ...
            // ];
            //
            // const numberOfRows = 2000; // or any large number for stress testing
            // return generateMockData(columns, numberOfRows) as T;

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
            console.log('mockedData', mockedData);
            await this.db.set(TableDataService.TABLE_KEY, JSON.stringify(mockedData.default), 60*60*24);
            return mockedData as T;

        } catch (error) {
            console.error('Error in getData:', error);

            // In case of any error, return an empty array of type T
            return [] as T;
        }
    }
    async updateData(data:RowData): Promise<boolean> {
        let {initialData,columns} = await this.getData<CompleteTableData>();
        let currData = initialData;
        if (currData) {
            for (let i = 0; i < currData.length; i++) {
                if (currData[i].id === data.id) {
                    if (currData) {
                        currData[i] = data;
                        break;
                    }
                }
            }
        }

        await this.db.set(TableDataService.TABLE_KEY, JSON.stringify({initialData:this.flattenGroupedData(currData),columns}), 60*60*24);
        return true;
    }
    async setData(data:CompleteTableData): Promise<boolean> {
        const savedData = data;
       // savedData.initialData = this.flattenGroupedData(savedData.initialData); //todo - assuming we dont want to save grouped data
        console.log("flattened data",savedData);
        this.db.set(TableDataService.TABLE_KEY, JSON.stringify(savedData), 60*60*24);
        return true;
    }
    // need to regroup after main value change?
    //todo -when editing a child the whole group is change which is a bug
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
    flattenGroupedData(groupedData: RowData[]): RowData[] {
        return groupedData.reduce((result, currentValue) => {
            if (currentValue.children) {
                result.push(...currentValue.children);
            }
            else {
                result.push(currentValue);
            }
            return result;
        }, [] as RowData[]);
    }

}
const tableDataService = new TableDataService();
export default tableDataService;