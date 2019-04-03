import React from 'react';
import Search from '../art/searchSvg';
import Cancel from '../art/cancelSvg';

const InputFilter = ({filter, onChange}) => (
    <>
        <input
            className='header_filter header_fill'
            type='text'
            placeholder='type to filter'
            value={filter}
            onChange={x => onChange(x.target.value)}
            onKeyUp={(x) => {
                // Clear the textbox on `esc` keypress
                if (x.keyCode === 27) onChange('');
            }}
        />

        {filter.length === 0 ? (
            <Search />
        ) : (
            <Cancel className='svg_button svg_error' onClick={() => onChange('')} />
        )}
    </>
);

export default InputFilter;
