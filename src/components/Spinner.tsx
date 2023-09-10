import { NextPage } from 'next';
import { PropsWithChildren } from 'react';
import { Spinner as SpinnerWheel } from 'react-bootstrap';

export interface SpinnerProps {
    size?: 'sm'
    animation?: 'border' | 'grow'
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
}

const Spinner:NextPage<PropsWithChildren<SpinnerProps>>  = (props:PropsWithChildren<SpinnerProps>)=> {
    return (
        <SpinnerWheel {...props} />
    )
}

export default Spinner;