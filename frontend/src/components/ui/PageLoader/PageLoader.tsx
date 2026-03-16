import { Center, Loader } from '@mantine/core';
import classes from './PageLoader.module.css';

export function PageLoader() {
  return (
    <Center className={classes.root}>
      <Loader />
    </Center>
  );
}
