import React from 'react';
import './editTable.scss';
interface HeaderProps {
    name: string;
    onRequestSort: (key: string) => void;
}

const Header: React.FC<HeaderProps> = ({ name, onRequestSort }) => {
    const handleSort = () => {
        console.log("handleSort");
        onRequestSort(name);
    };

    return (
        <th onClick={handleSort} >
            {name}
        </th>
    );
};

export default Header;
