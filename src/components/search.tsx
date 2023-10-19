import React, {useState} from 'react';
import './search.scss';

interface Props {
  onClick?: () => void;
  onChange?: (query:string) => void;
  value?: string;
}

const Search: React.FC<Props> = ({ onClick,value,onChange }) => {
    const [searchValue,setSearchValue] = useState(value??"");

    const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchValue = event.target.value;
        setSearchValue(newSearchValue)
        onChange?.(newSearchValue);
    }

  return (
      <div className={"search"}>
          <input placeholder={"Search the rows"} value={searchValue}
                 onChange={(event)=>{onInput(event)} }/>
      </div>
  );
};

export default Search;
