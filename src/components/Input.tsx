import { useField } from 'formik';
import React from 'react';
import { ReactComponent as Password } from '../assets/images/View.svg';
import { ReactComponent as PasswordHidden } from '../assets/images/hidden.svg';
import { ReactComponent as Search } from '../assets/images/searchIcon.svg';
import '../style/components/textinput.css';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    time?: boolean;
    label?: string;
    addClass?: string;
    type?: string;
    icon?: 'search' | 'password' | 'delete' | 'file' | 'toggle' | null;
    onIconClick?: (e: any) => void;
}

const TextInput: React.FC<Props> = ({
    label = '',
    addClass = '',
    type = '',
    icon = '',
    onIconClick,
    ...props
}) => {
    const [field, meta] = useField({ name: props.name });
    return (
        <div className={`input-group ${addClass ? addClass : ''}`}>
            <div className='flex'>
                {label && <label>{label}</label>}
            </div>
            <div className='relative'>
                <input className='text-field'
                    {...field}
                    {...props}
                    type={type}
                />
                {icon === 'password' && (
                    <div className='input-password onkeyup' onClick={onIconClick}>
                        {type === 'password' ? <Password /> : <PasswordHidden />}
                    </div>
                )}
                {icon === 'search' && (
                    <div className='input-password onkeyup' onClick={onIconClick}>
                        {type === 'search' ? <Search /> : ''}
                    </div>
                )}
            </div>
            {meta.touched && meta.error ? (
                <div className='aw-error'>{meta.error}</div>
            ) : null}
        </div>
    );
};

export default TextInput;
