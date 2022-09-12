import React from 'react';
import './App.css';
import { Alert, AlertTitle, Box, Button, Card, CardContent, CardHeader, Container, createTheme, IconButton, Stack, SvgIcon, ThemeProvider, Typography } from '@mui/material';
import {ReactComponent as UpArrow} from './svg/up.svg'
import {ReactComponent as DownArrow} from './svg/down.svg'
import {ReactComponent as LeftChevron} from './svg/left.svg'
import {ReactComponent as RightChevron} from './svg/right.svg'
import { calculateDocumentConsensus, calculateSectionConsensus } from './calculator';

interface Iteration {
  upvotes: number;
  downvotes: number;
  users: number;
  consensus: number;
  newThreshold: number;
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

function App() {
  const [documentUsers, setDocumentUsers] = React.useState(1);
  const [consensus, setConsensus] = React.useState(1);
  const [iterations, setIterations] = React.useState<Iteration[]>([{upvotes: 1, downvotes: 0, users: 1, consensus: 1, newThreshold: 1}]);
  function addIteration():void {
    const newUsers = getRandomNumber(1, 10);
    const lastIteration = iterations[iterations.length - 1];
    const upvotes = getRandomNumber(lastIteration.newThreshold, lastIteration.users + newUsers);
    const downvotes = Math.floor(Math.random() * (newUsers - upvotes));
    const users = lastIteration.users + newUsers;
    const consensus = calculateSectionConsensus(upvotes, downvotes, users, 'approval');
    const newThreshold = Math.ceil(consensus * users);
    setIterations([...iterations, {upvotes, downvotes, users, consensus,newThreshold }]);
    setDocumentUsers(users);
    setConsensus(calculateDocumentConsensus([...iterations.map(i => i.consensus), consensus]));
  }
  return (
    <ThemeProvider theme={createTheme({
      typography: {
        allVariants: {
          fontFamily: 'Space Mono',
        },
      },
      palette: {
        background: {
        }
      },
      shape: {
        borderRadius: 16
      }
    })}>
    <Container sx={{paddingY: 8,height:'100vh'}}>
    <Stack alignContent="center" justifyContent="center" spacing={4}>
      <Alert severity="info">
        <AlertTitle>Summary</AlertTitle>
          <Typography>Total Iterations: {iterations.length}</Typography>
          <Typography>Document Users: {documentUsers}</Typography>
          <Typography>Document Consensus: {consensus}</Typography>
        </Alert>
        <Stack spacing={2}>
          {iterations.map((iteration, i) => (
          <Card key={i} variant="outlined">
            <CardHeader title={`Iteration ${i + 1}`} />
            <CardContent>
              <Typography variant="subtitle1">Users: {iteration.users}</Typography>
              <Typography variant="subtitle1" color="success.main">{iteration.upvotes} upvotes</Typography>
              <Typography variant="subtitle1" color="error.main">{iteration.downvotes} downvotes</Typography>
              <Typography variant="subtitle1" color="primary.main">Consensus: {iteration.consensus}</Typography>
            </CardContent>
          </Card>
          ))}
          <Box position="fixed" bottom={16}>
            <Button size="large" variant="contained" onClick={addIteration}>Add Iteration</Button>
          </Box>
        </Stack>
    </Stack>
    </Container>
    </ThemeProvider>
  );
}


export default App;
