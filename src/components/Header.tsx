import React from 'react';

interface HeaderProps {
    name: string;
    onRequestSort: (key: string) => void;
}

const Header: React.FC<HeaderProps> = ({ name, onRequestSort }) => {
    const handleSort = () => {
        onRequestSort(name);
    };

    return (
        <th onClick={handleSort}>
            {name}
        </th>
    );
};

export default Header;
