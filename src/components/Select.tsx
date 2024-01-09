import React from 'react';
import '../style/components/select.css';

interface OptionValue {
    label: string;
    value: string;
}

interface Props extends React.InputHTMLAttributes<HTMLSelectElement> {
    value: string
    label: string
    options: OptionValue[]
}

const Selectoption: React.FC<Props> = ({
    label,
    options,
    ...rest
}) => {
    return (
        <div className='select-blk'>
            <form>
                <label>{label}</label>
                <select className='select' id='action' {...rest}>
                    {options.map((item: any, id: number) => (
                        <option key={id} value={item.value} disabled={!item.value}>{item.label}</option>
                    ))}
                </select>
            </form>
        </div>
    );
};

export default Selectoption;
