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
    borderFlattened:boolean
}

const Loader:NextPage<PropsWithChildren<LoaderProps>>  = (props:PropsWithChildren<LoaderProps>)=> {
    const { 
        borderFlattened,
        ...rest
    } = props;

    return (
        <ProgressBar style={borderFlattened===true ? {borderRadius:'0px'}:{}} {...rest}/>
    )
}

export default Loader;
  