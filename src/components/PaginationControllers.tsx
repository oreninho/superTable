import React, {useMemo} from "react";
import "./Pagination.scss";
interface PaginationControllersProps {
    currentPage: number;
    totalPageNumbers: number;
    onPageNumberClick: (pageNumber: number) => void;
    onPreviousPageClick: () => void;
    onNextPageClick: () => void;
}

const PaginationControllers: React.FC<PaginationControllersProps> = (props) => {
    const {currentPage, totalPageNumbers, onPageNumberClick, onPreviousPageClick, onNextPageClick} = props;
    const jumpValue =  totalPageNumbers > 10 ? 10 : totalPageNumbers;
    return useMemo(()=> <div className={"pagination"}>
        <button onClick={onPreviousPageClick} disabled={currentPage === 1}>
            Previous
        </button>
        {Array.from({length: totalPageNumbers}, (_, index) => (
            (index && index%jumpValue === 0 || index === 1) &&
            <button key={index} onClick={() => onPageNumberClick(index )}>
                {index }
            </button>
        ))}
        <button onClick={onNextPageClick} disabled={currentPage === totalPageNumbers}>
            Next
        </button>
    </div>,[currentPage,totalPageNumbers])
}
export default PaginationControllers;