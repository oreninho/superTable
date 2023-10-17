import React, {useState} from 'react';
import './search.scss';

interface Props {
  onClick: () => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const Search: React.FC<Props> = ({ onClick,value,onChange }) => {
    const [searchValue,setSearchValue] = useState(value??"");

    const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        onChange?.(event);
    }
  return (
      <div className={"search"}>
    {/*<button onClick={onClick}>*/}
    {/*  Search*/}
    {/*</button>*/}
          <input placeholder={"Search the rows"} value={searchValue}
                 onChange={(event)=>{onInput(event)} }/>
      </div>
  );
};

export default Search;
