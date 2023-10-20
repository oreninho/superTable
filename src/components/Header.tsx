import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

import './editTable.scss';
interface HeaderProps {
    id: string;
    name: string;
    ascending: boolean;
    onRequestSort: (key: string) => void;
}

const Header: React.FC<HeaderProps> = ({ name, onRequestSort,ascending,id }) => {
    const [isAscending, setIsAscending] = React.useState(ascending);
    const handleSort = () => {
        console.log("handleSort");
        setIsAscending(!isAscending);
        onRequestSort(id);
    };

    return (
        <th onClick={handleSort}  >
            {name} {isAscending ? <FaArrowUp /> : <FaArrowDown />}
        </th>
    );
};

export default Header;
