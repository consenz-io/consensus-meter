import React, { useEffect } from 'react';
import './App.css';
import { Alert, AlertTitle, Button, Card, CardContent, CardHeader, Container, createTheme, Dialog, DialogActions, DialogContent, IconButton, Stack, styled, SvgIcon, TextField, ThemeProvider, Typography } from '@mui/material';
import { calculateDocumentConsensus, calculateNewThreshold, calculateSectionConsensus } from './utils/calculator';
import {ReactComponent as Cog} from './svg/cog.svg'
import {ReactComponent as Chart} from './svg/chart.svg'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2'
import { getRandomInt } from './utils/functions';

interface Iteration {
  upvotes: number;
  downvotes: number;
  users: number;
  consensus: number;
  newThreshold: number;
  documentConsensus: number;
}

const RotatingIcon = styled(IconButton)({
  '&:hover': {
    transform: 'rotate(90deg)'
  },
  'transition': '0.5s',
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [initialThreshold, setInitialThreshold] = React.useState(1);
  const [isChartVisible, setIsChartVisible] = React.useState(false);
  const [documentUsers, setDocumentUsers] = React.useState(1);
  const [consensus, setConsensus] = React.useState(1);
  const [iterations, setIterations] = React.useState<Iteration[]>([{upvotes: 1, downvotes: 0, users: 1, consensus: 1, newThreshold: 1, documentConsensus: 1}]);
  const [settings, setSettings] = React.useState(false);
  const [newUsersLimit, setNewUsersLimit] = React.useState(10);

  // reset iterations when initial threshold changes
  useEffect(() => 
    setIterations([
      {
        upvotes: initialThreshold, 
        downvotes: 0, 
        users: initialThreshold, 
        consensus: 1, 
        newThreshold: initialThreshold, 
        documentConsensus: 1
      }
    ]), 
    [initialThreshold]
  );

  /**
   * Calculates the consensus for the next iteration, then add it to the list of iterations
   * Update the document consensus as well
   */
  function addIteration(): void {
    const lastIteration = iterations[iterations.length - 1];
    const newUsers = getRandomInt(0, newUsersLimit);
    const users = lastIteration.users + newUsers;
    const downvotes = getRandomInt(0, (users - lastIteration.newThreshold) / 2);
    const upvotes = getRandomInt(lastIteration.newThreshold + downvotes, users - downvotes);
    const sectionConsensus = calculateSectionConsensus(upvotes, downvotes, users, 'approval');
    const documentConsensus = calculateDocumentConsensus([...iterations.map(i => i.consensus), sectionConsensus])
    const newThreshold = calculateNewThreshold(documentConsensus, users);
    setIterations([...iterations, {upvotes, downvotes, users, consensus: sectionConsensus,newThreshold, documentConsensus }]);
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
    <Stack position="absolute" margin={1} spacing={1}>
      <IconButton onClick={() => setIsChartVisible(true)}><SvgIcon><Chart/></SvgIcon></IconButton>
      <RotatingIcon onClick={() => setSettings(true)}><SvgIcon><Cog/></SvgIcon></RotatingIcon>
    </Stack>
    <Dialog open={settings} onClose={() => setSettings(false)}>
      <DialogContent>
        <Stack spacing={2}>
          <TextField label="New users per iteration limit" type="number" value={newUsersLimit} onChange={(v) => setNewUsersLimit(+v.target.value)}/>
          <TextField label="Initial Threshold" type="number" value={initialThreshold} onChange={(v) => setInitialThreshold(+v.target.value)}/>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSettings(false)}>Done</Button>
      </DialogActions>
    </Dialog>
    <Dialog open={isChartVisible} onClose={() => setIsChartVisible(false)} maxWidth="md" fullWidth>
      <DialogContent>
        <Line data={{labels:iterations.map((o, i) => i), datasets:[
            {data:iterations.map(i => i.consensus),label:"Iteration Consensus", borderColor: "hsl(200, 50%, 50%)"},
            {data:iterations.map(i => i.documentConsensus), label: "Document Consensus", borderColor: "hsl(100, 50%, 50%)"},
          ]}} />
      </DialogContent>
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
        </Stack>
        <Stack position="fixed" bottom={16} display="flex" justifyItems="end" flexGrow={1}>
          <Button size="large" variant="contained" onClick={addIteration}>Add Iteration</Button>
        </Stack>
    </Stack>
    </Container>
    </ThemeProvider>
  );
}


export default App;
