import { NextPage } from 'next';
import { PropsWithChildren } from 'react';
import { ProgressBar } from 'react-bootstrap';
import Loader from './Loader';

interface ProgressBarProps {
    percentage:number
}

const Health:NextPage<PropsWithChildren<ProgressBarProps>>  = (props:PropsWithChildren<ProgressBarProps>)=> {
    const {percentage} = props
    return (
        <Loader percentage={percentage} />
    )
}
  