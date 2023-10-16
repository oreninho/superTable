import React from 'react';
import './SearchButton.css';

interface Props {
  onClick: () => void;
}

const SearchButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button className="search-button" onClick={onClick}>
      Search
    </button>
  );
};

export default SearchButton;
