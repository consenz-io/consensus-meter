import React from 'react';
import './App.css';
import { Alert, AlertTitle, Box, Button, Card, CardContent, CardHeader, Container, createTheme, Dialog, Fab, IconButton, Stack, styled, SvgIcon, TextField, ThemeProvider, Typography } from '@mui/material';
import { calculateDocumentConsensus, calculateSectionConsensus } from './calculator';
import {ReactComponent as Cog} from './svg/cog.svg'

interface Iteration {
  upvotes: number;
  downvotes: number;
  users: number;
  consensus: number;
  newThreshold: number;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

const RotatingIcon = styled(IconButton)({
  '&:hover': {
    'transition': '0.5s',
  },
  transform: 'rotate(90deg)'
});

function App() {
  const [documentUsers, setDocumentUsers] = React.useState(1);
  const [consensus, setConsensus] = React.useState(1);
  const [iterations, setIterations] = React.useState<Iteration[]>([{upvotes: 1, downvotes: 0, users: 1, consensus: 1, newThreshold: 1}]);
  const [settings, setSettings] = React.useState(false);
  const [newUsersLimit, setNewUsersLimit] = React.useState(10);
  
  function addIteration(): void {
    const lastIteration = iterations[iterations.length - 1];
    const newUsers = getRandomInt(0, newUsersLimit);
    const users = lastIteration.users + newUsers;
    const downvotes = getRandomInt(0, (users - lastIteration.newThreshold) / 2);
    const upvotes = getRandomInt(lastIteration.newThreshold + downvotes, users - downvotes);
    const sectionConsensus = calculateSectionConsensus(upvotes, downvotes, users, 'approval');
    const documentConsensus = calculateDocumentConsensus([...iterations.map(i => i.consensus), sectionConsensus])
    const newThreshold = Math.ceil(documentConsensus * users);
    setIterations([...iterations, {upvotes, downvotes, users, consensus: sectionConsensus,newThreshold }]);
    setDocumentUsers(users);
    setConsensus(calculateDocumentConsensus([...iterations.map(i => i.consensus), sectionConsensus]));
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
    <RotatingIcon sx={{position: 'absolute', margin: 1}} onClick={() => setSettings(true)}><SvgIcon><Cog/></SvgIcon></RotatingIcon>
    <Dialog open={settings} onClose={() => setSettings(false)}>
      <Card>
        <CardContent>
          <TextField label="New users per iteration limit" type="number" value={newUsersLimit} onChange={(v) => setNewUsersLimit(+v.target.value)}/>
        </CardContent>
      </Card>
    </Dialog>
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
              <Typography variant="subtitle1" color="primary.seconday">New Threshold: {iteration.newThreshold}</Typography>
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
