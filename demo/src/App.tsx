import React from 'react';
import './App.css';
import { Alert, AlertTitle, Box, Card, CardContent, CardHeader, Container, createTheme, IconButton, Stack, SvgIcon, ThemeProvider, Typography } from '@mui/material';
import {ReactComponent as UpArrow} from './svg/up.svg'
import {ReactComponent as DownArrow} from './svg/down.svg'
import {ReactComponent as LeftChevron} from './svg/left.svg'
import {ReactComponent as RightChevron} from './svg/right.svg'

function App() {
  const [documentUsers, setDocumentUsers] = React.useState(1);
  const [consensus, setConsensus] = React.useState(1);
  const [sections, setSections] = React.useState([{suggestions: [{upvotes: 1, downvotes: 0}], currentSuggestion: 0}]);
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
          <Typography>Document Users: {documentUsers}</Typography>
          <Typography>Document Consensus: {consensus}</Typography>
        </Alert>
        <Stack spacing={2} paddingX={2}>
          {sections.map((section, index) => (
          <Card key={index} variant="outlined">
            <CardHeader title={`Section ${index + 1}`} />
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton size="large" color="warning">
                  <SvgIcon><LeftChevron/></SvgIcon>
                </IconButton>
                <Stack>
                  <IconButton color="success"><SvgIcon><UpArrow/></SvgIcon></IconButton>
                  <IconButton color="error"><SvgIcon><DownArrow/></SvgIcon></IconButton>
                </Stack>
                <Box flexGrow={1}>
                <Typography variant="h6">Suggestion {section.currentSuggestion + 1}</Typography>
                <Typography variant="subtitle1" color="success.main">{section.suggestions[section.currentSuggestion].upvotes} upvotes</Typography>
                <Typography variant="subtitle1" color="error.main">{section.suggestions[section.currentSuggestion].downvotes} downvotes</Typography>
                </Box>
                <IconButton size="large" color="warning">
                  <SvgIcon><RightChevron/></SvgIcon>
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
          ))}
        </Stack>
    </Stack>
    </Container>
    </ThemeProvider>
  );
}


export default App;
