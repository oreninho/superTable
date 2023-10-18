
/*
all the related db code is not used in this project
 */
import {CompleteTableData, RowData} from "../../components/types";
import {dataService} from "./dataService";
import mockedData from '../../data/mocked-data.json';


class TableDataService {
    private db = dataService;
    private static TABLE_KEY = 'tableData';
    constructor() {
        if (!localStorage.getItem(TableDataService.TABLE_KEY)) {
            localStorage.setItem(TableDataService.TABLE_KEY, JSON.stringify([]));
        }
    }

    async getData<T>(): Promise<T> {
        try {
            let possibleData = await this.db.get(TableDataService.TABLE_KEY);

            // If data exists in the storage, parse and return it
            if (possibleData) {
                let data = JSON.parse(possibleData.toString());
                console.log('getData', data);
                return data as T;
            }

            // If no data was found in the storage, use the mocked data
            console.log('No data found, setting default data.');
            await this.db.set(TableDataService.TABLE_KEY, JSON.stringify(mockedData), 60*60*24);
            return mockedData as T;
        } catch (error) {
            console.error('Error in getData:', error);

            // In case of any error, return an empty array of type T
            return [] as T;
        }
    }

    // data should be row data
    async updateData(data:RowData): Promise<boolean> {
        let {initialData,columns} = await this.getData<CompleteTableData>();
        let currData = initialData;
        currData.forEach((row:RowData,index)=>{
            if(row.id === data.id){
                currData[index] = data;
            }
        });
        await this.db.set(TableDataService.TABLE_KEY, JSON.stringify({initialData:currData,columns}), 60*60*24);
        return true;
    }
    async loadFile(jsonFile:File): Promise<CompleteTableData> {
        let data = jsonFile.stream();
        if(data){
            return JSON.parse(data.toString());
        }
        return {initialData:[],columns:[]};

    }

}
const tableDataService = new TableDataService();
export default tableDataService;