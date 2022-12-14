import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import useEth from "../contexts/EthContext/useEth";

// Actions accessible only for the smart contract's owner
function OwnerBtns({ workflowStatus, setWorkflowStatus, setIsVoter, getWinningProposalID, getWorkflowStatus }) {
  const { state: { contract, accounts } } = useEth();
  const [voterToAdd, setVoterToAdd] = useState("");

  const handleAddVoterAddressChange = e => {
    setVoterToAdd(e.target.value);
  };

  // Register a new voter and set the associated state variable
  const addVoter = async () => {
    try {
      await contract.methods.addVoter(voterToAdd).call({ from: accounts[0] });
      await contract.methods.addVoter(voterToAdd).send({ from: accounts[0] });
      if (voterToAdd === accounts[0]) {
        setIsVoter(true);
      }
    } catch (err) {
      alert(err);
    }
  };

  // Start the proposal registering and update the workflow status state
  const startProposalsRegistering = async () => {
    try {
      await contract.methods.startProposalsRegistering().call({ from: accounts[0] });
      await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
      getWorkflowStatus();
    } catch (err) {
      alert(err);
    }
  };

  // End the proposal registering and update the workflow status state
  const endProposalsRegistering = async () => {
    try {
      await contract.methods.endProposalsRegistering().call({ from: accounts[0] });
      await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
      getWorkflowStatus();
    } catch (err) {
      alert(err);
    }
  };

  // Start the voting session and update the workflow status state
  const startVotingSession = async () => {
    try {
      await contract.methods.startVotingSession().call({ from: accounts[0] });
      await contract.methods.startVotingSession().send({ from: accounts[0] });
      getWorkflowStatus();
    } catch (err) {
      alert(err);
    }
  };

  // End the voting session and update the workflow status state
  const endVotingSession = async () => {
    try {
      await contract.methods.endVotingSession().call({ from: accounts[0] });
      await contract.methods.endVotingSession().send({ from: accounts[0] });
      getWorkflowStatus();
    } catch (err) {
      alert(err);
    }
  };

  // Tally votes and update the workflow status state + winning proposal state
  const tallyVotes = async () => {
    try {
      await contract.methods.tallyVotes().call({ from: accounts[0] });
      await contract.methods.tallyVotes().send({ from: accounts[0] });
      getWorkflowStatus();
      getWinningProposalID();
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    // Initiate workflow status when contract is loaded
    const getWorkflowStatus = async () => {
      try {
        const workflowStatus = await contract.methods.workflowStatus().call({ from: accounts[0] });
        setWorkflowStatus(workflowStatus);
      } catch (err) {
        alert(err);
      }
    };
    getWorkflowStatus();
  }, [contract]);

  return (
    <div className="btns">
      <Grid container spacing={2} direction="column" justifyContent="space-between" alignItems="center">
        <Grid item xs={8}>
          {
            workflowStatus === '0' && <Button variant="contained" onClick={startProposalsRegistering}>Start the proposal registration</Button>
          }
          {
            workflowStatus === '1' && <Button variant="contained" onClick={endProposalsRegistering}>End the proposal registration</Button>
          }
          {
            workflowStatus === '2' && <Button variant="contained" onClick={startVotingSession}>Start the voting session</Button>
          }
          {
            workflowStatus === '3' && <Button variant="contained" onClick={endVotingSession}>End the voting session</Button>
          }
          {
            workflowStatus === '4' && <Button variant="contained" onClick={tallyVotes}>Find the winning proposal</Button>
          }
        </Grid>
        {
          workflowStatus === '0' && 
          <Grid item xs={8}>
            <Stack spacing={2} direction="row">
              <Button variant="contained" onClick={addVoter}>Add a voter</Button>
              <TextField 
                id="outlined-basic"
                label="Type address.."
                variant="outlined"
                value={voterToAdd}
                onChange={handleAddVoterAddressChange}
              />
            </Stack>
          </Grid>
        }
      </Grid>
    </div>
  );
}

export default OwnerBtns;
