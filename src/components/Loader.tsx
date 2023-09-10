import { NextPage } from 'next';
import { PropsWithChildren } from 'react';
import { ProgressBar } from 'react-bootstrap';

export interface LoaderProps {
    percentage?: number
    min?: number
    now?: number
    max?: number
    striped?: boolean
    animated?: boolean
    variant?: 'success' | 'danger' | 'warning' | 'info'
}

const Loader:NextPage<PropsWithChildren<LoaderProps>>  = (props:PropsWithChildren<LoaderProps>)=> {
    return (
        <ProgressBar {...props}/>
    )
}

export default Loader;
  